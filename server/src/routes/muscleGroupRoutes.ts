import express, { Router } from 'express';
import { getAllMuscleGroups } from '../controllers/muscleGroupController';
import { authenticateAccessToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get("/muscle-groups", authenticateAccessToken, getAllMuscleGroups);

export default router;
