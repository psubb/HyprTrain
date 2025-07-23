import express, { Router } from 'express';
import { addWorkoutDays } from '../controllers/workoutDayController';
import { authenticateAccessToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post("/programs/:id/workout-days", authenticateAccessToken, addWorkoutDays);

export default router;