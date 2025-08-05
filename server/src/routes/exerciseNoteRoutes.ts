import express, { Router } from "express";
import { createExerciseNote } from "../controllers/exerciseNoteController";
import { authenticateAccessToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/workout-exercises/:id/note", authenticateAccessToken, createExerciseNote);

export default router;