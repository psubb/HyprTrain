import { addExerciseSet as addExerciseSetService, deleteLastExerciseSet as deleteExerciseSetService } from "../services/exerciseSetService";
import { Request, Response } from "express";

export async function addExerciseSet(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: User not found'});
        return;
    }

    const { propagate } = req.body;
    const workoutExerciseId = req.params.id;

    try {
        const addedSets = await addExerciseSetService(workoutExerciseId, propagate);
        res.status(201).json(addedSets);
    } catch (err: any){
        res.status(500).json({message: err.message || "Error while adding sets"})
    }
}

export async function deleteLastExerciseSet(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: User not found'});
        return;
    }

    const { propagate } = req.body;
    const workoutExerciseId = req.params.id;

    try {
        const deletedSets = await deleteExerciseSetService(workoutExerciseId, propagate);
        res.status(200).json(deletedSets);
    } catch (err: any){
        res.status(500).json({message: err.message || "Error while deleting sets"})
    }
}