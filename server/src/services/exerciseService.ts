import { insertCustomExercise, findExerciseByNameForUser, softDeleteExerciseById } from "../models/exerciseModel";
import { Exercise } from "../types/Exercise";

export async function createCustomExercise(userId: string, exerciseName: string, muscleGroupId: string): Promise<Exercise>{
    const trimmedName = exerciseName.trim();

    if (!trimmedName){
        throw new Error("Exercise name cannot be empty");
    }
    
    const existing = await findExerciseByNameForUser(userId, trimmedName);
    if (existing){
        throw new Error("Exercise already exists")
    }
    return await insertCustomExercise(userId, trimmedName, muscleGroupId);
}

export async function deleteCustomExercise(userId: string, exerciseId: string): Promise<Exercise> {
    const deletedExercise = await softDeleteExerciseById(userId, exerciseId);

    if (!deletedExercise){
        throw new Error("Custom exercise not found or already deleted");
    }

    return deletedExercise;
}