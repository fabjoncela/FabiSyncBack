"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.get("/", dashboardController_1.getDashboardMetrics);
//if we add smth to the / , ex /hi , it would be http://localhost:8000/dashboard/hi
exports.default = router;
