import { Request, Response } from "express";
import { editDailyNote as editDailyNoteService, deleteDailyNote as deleteDailyNoteService } from "../services/dailyNoteService";

export async function editDailyNote(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: User not found'});
        return;
    }
    const dailyNoteId = req.params.id;
    const { note } = req.body;

    if (!note || typeof note !== 'string'){
        res.status(400).json({ message: "Note text is required." });
        return;
    }

    try {
        const updatedNote = await editDailyNoteService(dailyNoteId, note);
        res.status(200).json(updatedNote);
    } catch (err: any){
        res.status(500).json({message: err.message || "Error updating note"})
    }
}

export async function deleteDailyNote(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: User not found'});
        return;
    }

    const dailyNoteId = req.params.id;

    try {
        const deletedNote = await deleteDailyNoteService(dailyNoteId);
        
        if (!deletedNote){
            res.status(404).json({message: "Daily note not found"});
            return;
        }

        res.status(200).json({deletedNote});
    } catch (err: any){
        res.status(500).json({message: err.message || "Error deleting daily note"});
    }
}