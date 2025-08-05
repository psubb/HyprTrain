import { createExerciseNote as createExerciseNoteModel } from "../models/exerciseNoteModel";
import { ExerciseNote } from "../types/ExerciseNote";

export async function createExerciseNote(exerciseId: string, note: string): Promise<ExerciseNote> {
    return await createExerciseNoteModel(exerciseId, note);
}