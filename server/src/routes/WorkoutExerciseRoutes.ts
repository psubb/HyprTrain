import express, { Router } from 'express';
import { addExercisesToWorkoutDayTemplate } from '../controllers/workoutExerciseController';
import { authenticateAccessToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post("/workout-days/:id/exercises", authenticateAccessToken, addExercisesToWorkoutDayTemplate);

export default router;