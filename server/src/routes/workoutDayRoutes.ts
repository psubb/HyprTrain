import express, { Router } from 'express';
import { addWorkoutDays, getActiveWorkoutDay } from '../controllers/workoutDayController';
import { authenticateAccessToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post("/programs/:id/workout-days", authenticateAccessToken, addWorkoutDays);
router.get("/programs/:id/active-day", authenticateAccessToken, getActiveWorkoutDay);

export default router;