import express, { Router } from "express";
import { createProgram, getActiveProgram } from "../controllers/programController";
import { authenticateAccessToken } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/programs", authenticateAccessToken, createProgram);
router.get("/programs/active", authenticateAccessToken, getActiveProgram);

export default router;