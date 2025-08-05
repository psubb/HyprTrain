import { authenticateAccessToken } from "../middleware/authMiddleware";
import { logExerciseSet } from "../controllers/exerciseLogController";
import express, { Router } from "express";

const router = express.Router();

router.post("/exercise-sets/:id/log", authenticateAccessToken, logExerciseSet);

export default router;