import express, { Router } from "express";
import { createExerciseNote, editExerciseNote } from "../controllers/exerciseNoteController";
import { authenticateAccessToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/workout-exercises/:id/note", authenticateAccessToken, createExerciseNote);
router.patch("/exercise-notes/:id", authenticateAccessToken, editExerciseNote);

export default router;