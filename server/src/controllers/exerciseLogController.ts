import { logExerciseSet as logExerciseSetService } from "../services/exerciseLogService";
import { Request, Response } from "express";

export async function logExerciseSet(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: User not found'});
        return;
    }

    const exerciseSetId = req.params.id;
    const { reps, weight, rpe} = req.body;

    if (typeof reps !== 'number' || typeof weight !== "number"){
        res.status(400).json({ message: "Reps and weight are required" });
        return;
    }

    try {
        const loggedSet = await logExerciseSetService(exerciseSetId, reps, weight, rpe);
        res.status(201).json(loggedSet);
    } catch (err: any){
        res.status(500).json({message: err.message || "Error while logging set"})
    }
}