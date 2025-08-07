import express, { Router } from "express";
import { addExerciseSet } from "../controllers/exerciseSetController";
import { authenticateAccessToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/workout-exercises/:id/sets", authenticateAccessToken, addExerciseSet);

export default router;