import express, { Router } from 'express';
import { editDailyNote } from "../controllers/dailyNoteController";
import { authenticateAccessToken } from "../middleware/authMiddleware";

const router = express.Router();

router.patch("/daily-notes/:id", authenticateAccessToken, editDailyNote);

export default router;