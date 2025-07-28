import { Request, Response } from "express";
import { createCustomExercise as createCustomExerciseService } from "../services/exerciseService";

export async function createCustomExercise(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: User not found'});
        return;
    }

    const { exerciseName, muscleGroupId } = req.body;

    try {
        const exercise = await createCustomExerciseService(userId, exerciseName, muscleGroupId);
        res.status(201).json(exercise);
    } catch (err: any) {
        res.status(400).json({message: err.message || "Failed to create exercise"});
    }
}