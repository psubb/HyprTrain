import express, { Router } from 'express';
import { editDailyNote, deleteDailyNote } from "../controllers/dailyNoteController";
import { authenticateAccessToken } from "../middleware/authMiddleware";

const router = express.Router();

router.patch("/daily-notes/:id", authenticateAccessToken, editDailyNote);
router.delete("/daily-notes/:id", authenticateAccessToken, deleteDailyNote);

export default router;