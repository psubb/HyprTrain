import express, { Router } from 'express';
import { createCustomExercise, deleteCustomExercise } from '../controllers/exerciseController';
import { authenticateAccessToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post("/exercises", authenticateAccessToken, createCustomExercise);
router.delete("/exercises/:id", authenticateAccessToken, deleteCustomExercise);

export default router;