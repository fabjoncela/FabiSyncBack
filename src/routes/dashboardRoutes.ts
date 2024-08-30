import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardController";

const router = Router();

router.get("/", getDashboardMetrics); 
//if we add smth to the / , ex /hi , it would be http://localhost:8000/dashboard/hi

export default router;

