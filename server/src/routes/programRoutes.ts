import express, { Router } from "express";
import { createProgram, getActiveProgram, getProgramsForUser, getWorkoutWeekOverview } from "../controllers/programController";
import { authenticateAccessToken } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/programs", authenticateAccessToken, createProgram);
router.get("/programs/active", authenticateAccessToken, getActiveProgram);
router.get("/programs/:id/weeks/:selectedWeek", authenticateAccessToken, getWorkoutWeekOverview);
router.get("/programs", authenticateAccessToken, getProgramsForUser);

export default router;