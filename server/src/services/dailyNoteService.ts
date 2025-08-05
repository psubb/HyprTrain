import { editDailyNote as editDailyNoteModel, deleteDailyNote as deleteDailyNoteModel } from "../models/dailyNoteModel";
import { DailyNote } from "../types/DailyNote";

export async function editDailyNote(id: string, note: string): Promise<DailyNote> {
    return await editDailyNoteModel(id, note);
}

export async function deleteDailyNote(id: string): Promise<DailyNote | null> {
    return await deleteDailyNoteModel(id);
}