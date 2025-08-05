import { ExerciseLog } from "../types/ExerciseLog";
import { logExerciseSet as logExerciseSetModel } from "../models/exerciseLogModel";

export async function logExerciseSet(exerciseSetId: string, reps: number, weight: number, rpe: number | null): Promise<ExerciseLog>{
    return await logExerciseSetModel(exerciseSetId, reps, weight, rpe);
}