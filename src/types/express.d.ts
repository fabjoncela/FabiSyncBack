// src/types/express.d.ts
import { Request } from 'express';

interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User; // Use the defined User type here
    }
  }
}
