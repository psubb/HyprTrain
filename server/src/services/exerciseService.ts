import { insertCustomExercise, findExerciseByNameForUser } from "../models/exerciseModel";
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