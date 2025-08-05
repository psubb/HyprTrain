import { editDailyNote as editDailyNoteModel } from "../models/dailyNoteModel";
import { DailyNote } from "../types/DailyNote";

export async function editDailyNote(id: string, note: string): Promise<DailyNote> {
    return await editDailyNoteModel(id, note);
}