import { createExerciseNote as createExerciseNoteModel, editExerciseNote as editExerciseNoteModel, deleteExerciseNote as deleteExerciseNoteModel } from "../models/exerciseNoteModel";
import { ExerciseNote } from "../types/ExerciseNote";

export async function createExerciseNote(exerciseId: string, note: string): Promise<ExerciseNote> {
    return await createExerciseNoteModel(exerciseId, note);
}

export async function editExerciseNote(id: string, note: string): Promise<ExerciseNote>{
    return await editExerciseNoteModel(id, note);
}

export async function deleteExerciseNote(id: string): Promise<ExerciseNote | null>{
    return await deleteExerciseNoteModel(id);
}