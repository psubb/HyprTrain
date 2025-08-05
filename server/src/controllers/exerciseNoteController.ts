import { Request, Response } from "express";
import { createExerciseNote as createExerciseNoteService } from "../services/exerciseNoteService";

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