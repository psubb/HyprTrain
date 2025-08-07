import express, { Router } from "express";
import { addExerciseSet, deleteLastExerciseSet } from "../controllers/exerciseSetController";
import { authenticateAccessToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/workout-exercises/:id/sets", authenticateAccessToken, addExerciseSet);
router.delete("/workout-exercises/:id/sets", authenticateAccessToken, deleteLastExerciseSet);

export default router;