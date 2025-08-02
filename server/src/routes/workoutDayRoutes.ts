import express, { Router } from 'express';
import { addWorkoutDays, getActiveWorkoutDay, getWorkoutDayLog } from '../controllers/workoutDayController';
import { authenticateAccessToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post("/programs/:id/workout-days", authenticateAccessToken, addWorkoutDays);
router.get("/programs/:id/active-day", authenticateAccessToken, getActiveWorkoutDay);
router.get("/workout-days/:id/log", authenticateAccessToken, getWorkoutDayLog);

export default router;