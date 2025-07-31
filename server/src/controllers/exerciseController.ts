import { Request, Response } from "express";
import { createCustomExercise as createCustomExerciseService, deleteCustomExercise as deleteCustomExerciseService, getCustomExercises as getCustomExercisesService, getExercisesByMuscleGroup as getExercisesByMuscleGroupService } from "../services/exerciseService";

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

export async function deleteCustomExercise(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: "Unauthorized: User not found"});
        return;
    }

    const exerciseId = req.params.id;

    try {
        const deletedExercise = await deleteCustomExerciseService(userId, exerciseId);
        res.status(200).json(deletedExercise);
    } catch (err: any) {
        res.status(400).json({message: err.message || "Failed to delete exercise"});
    }
}

export async function getCustomExercises(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: "Unauthorized: User not found"});
        return;
    }

    try {
        const customExercises = await getCustomExercisesService(userId);
        res.status(200).json(customExercises);
    } catch (err: any) {
        res.status(500).json({ message: err.message || "Failed to fetch custom exercises" });
  }
}

export async function getExercisesByMuscleGroup(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: "Unauthorized: User not found"});
        return;
    }

    const muscleGroupId = req.query.muscle_group_id as string;

    try {
        const muscleGroupExercises = await getExercisesByMuscleGroupService(userId, muscleGroupId);
        res.status(200).json(muscleGroupExercises);
    } catch (err: any) {
        res.status(500).json({message: err.message || "Failed to fetch exercises for muscle group"});
    }
}