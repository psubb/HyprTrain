import express, { Router } from 'express';
import { addWorkoutDays, getActiveWorkoutDay, getWorkoutDayLog, createDailyNote } from '../controllers/workoutDayController';
import { authenticateAccessToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Workout Day creattion and state
router.post("/programs/:id/workout-days", authenticateAccessToken, addWorkoutDays);
router.get("/programs/:id/active-day", authenticateAccessToken, getActiveWorkoutDay);

// Workout Day logging
router.get("/workout-days/:id/log", authenticateAccessToken, getWorkoutDayLog);
router.post("/workout-days/:id/daily-note", authenticateAccessToken, createDailyNote);

export default router;