import express, { Router } from 'express';
import { createCustomExercise } from '../controllers/exerciseController';
import { authenticateAccessToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post("/exercises", authenticateAccessToken, createCustomExercise)

export default router;