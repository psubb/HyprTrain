import { Request, Response } from "express";
import { createExerciseNote as createExerciseNoteService, editExerciseNote as editExerciseNoteService, deleteExerciseNote as deleteExerciseNoteService } from "../services/exerciseNoteService";

export async function createExerciseNote(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: User not found'});
        return;
    }

    const { note } = req.body;
    const exerciseId = req.params.id;

    if (!note || typeof note !== 'string'){
        res.status(400).json({ message: "Note text is required." });
        return;
    }

    try {
        const exerciseNote = await createExerciseNoteService(exerciseId, note);
        res.status(201).json({exerciseNote});
    } catch (err: any){
        res.status(500).json({message: err.message || "Error creating exercise note"});
    }
}

export async function editExerciseNote(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: User not found'});
        return;
    }

    const { note } = req.body;
    const exerciseNoteId = req.params.id;

    if (!note || typeof note !== 'string'){
        res.status(400).json({ message: "Note text is required." });
        return;
    }

    try {
        const exerciseNote = await editExerciseNoteService(exerciseNoteId, note);
        res.status(200).json({exerciseNote});
    } catch (err: any){
        res.status(500).json({message: err.message || "Error updating exercise note"});
    }
}

export async function deleteExerciseNote(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: User not found'});
        return;
    }

    const exerciseNoteId = req.params.id;

    try {
        const deletedNote = await deleteExerciseNoteService(exerciseNoteId);
        
        if (!deletedNote){
            res.status(404).json({message: "Exercise note not found"});
            return;
        }

        res.status(200).json({deletedNote});
    } catch (err: any){
        res.status(500).json({message: err.message || "Error deleting exercise note"});
    }
}