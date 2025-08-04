import { Request, Response } from 'express';
import { createWorkoutDaysForProgram, getActiveWorkoutDay as getActiveWorkoutDayService, getWorkoutDayLog as getWorkoutDayService, createDailyNote as createDailyNoteService } from '../services/workoutDayService';

export async function addWorkoutDays(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({message: 'Unauthorized: No user ID found.'});
        return;
    }

    const programId = req.params.id;
    const { daysOfWeek, durationWeeks } = req.body;

    if (
        !Array.isArray(daysOfWeek) ||
        daysOfWeek.some((day: any) => typeof day !== 'number' || day < 0 || day > 6)
    ) {
        res.status(400).json({ message: 'daysOfWeek must be an array of integers between 0 and 6.' });
        return;
    }

    if (durationWeeks < 4 || durationWeeks > 16) {
        res.status(400).json({message: 'duration_weeks must be a number between 4 to 16 weeks.'});
        return;
    }

    const workoutDays = await createWorkoutDaysForProgram(programId, daysOfWeek, durationWeeks);

    res.status(201).json({message: 'Workout days created succesfully', workoutDays});
}

export async function getActiveWorkoutDay(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({message: 'Unauthorized: No user ID found.'});
        return;
    }

    const programId = req.params.id;

    if (!programId){
        res.status(400).json({message: 'Missing programId in URL'});
        return;
    }

    try{
        const activeWorkoutDay = await getActiveWorkoutDayService(programId, userId);
        res.status(200).json(activeWorkoutDay);
    } catch (err: any) {
        res.status(500).json({message: err.message || "Issue getting active workout day."})
    }
}

export async function getWorkoutDayLog(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({message: 'Unauthorized: No user ID found.'});
        return;
    }

    const workoutDayId = req.params.id;

    if (!workoutDayId){
        res.status(400).json({message: 'Missing workoutDayId in URL'});
        return;
    }

    try {
        const workoutDayLog = await getWorkoutDayService(userId, workoutDayId);
        res.status(200).json(workoutDayLog);
    } catch (err: any) {
        res.status(500).json({message: err.message || "Error getting workout day log"});
    }
}

export async function createDailyNote(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: No user ID found.'});
        return; 
    }

    const workoutDayId = req.params.id;

    if (!workoutDayId){
        res.status(400).json({message: 'Missing workoutDayId in URL'});
        return;
    }

    const { note } = req.body;

    if (!note || typeof note !== 'string'){
        res.status(400).json({ message: "Note text is required." });
        return;
    }

    try {
        const dailyNote = await createDailyNoteService(workoutDayId, note);
        res.status(201).json(dailyNote);
    } catch (err: any){
        res.status(500).json({message: err.message || "Error creating daily note"});
    }
}