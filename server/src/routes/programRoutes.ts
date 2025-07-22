import express, { Router } from "express";
import { createProgram } from "../controllers/programController";
import { authenticateAccessToken } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/programs", authenticateAccessToken, createProgram);

export default router;