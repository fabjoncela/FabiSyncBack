import express, { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import dashboardRoutes from "./routes/dashboardRoutes";
// import productRoutes from "./routes/productRoutes";
// import userRoutes from "./routes/userRoutes";
// import expenseRoutes from "./routes/expenseRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.get("/hello", (req, res) => {
    res.send("hello world2");
})

app.use("/dashboard", dashboardRoutes);
// app.use("/products", productRoutes); 
// app.use("/users", userRoutes); 
// app.use("/expenses", expenseRoutes); 

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Signup route
app.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });
    
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
});

// Login route
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to protect routes
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { userId: verified.userId, name: '', email: '', password: '' }; // Adjust if you have more info in payload
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

/* SERVER */
const port = Number(process.env.PORT) || 3001;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
