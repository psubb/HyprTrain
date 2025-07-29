import express, { Router } from 'express';
import { createCustomExercise, deleteCustomExercise, getCustomExercises } from '../controllers/exerciseController';
import { authenticateAccessToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post("/exercises", authenticateAccessToken, createCustomExercise);
router.delete("/exercises/:id", authenticateAccessToken, deleteCustomExercise);
router.get("/exercises/custom", authenticateAccessToken, getCustomExercises);


export default router;