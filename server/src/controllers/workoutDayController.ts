import { Request, Response } from 'express';
import { createWorkoutDaysForProgram, getActiveWorkoutDay as getActiveWorkoutDayService } from '../services/workoutDayService';

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
    try{
        const activeWorkoutDay = await getActiveWorkoutDayService(programId, userId);
        res.status(200).json(activeWorkoutDay);
    } catch (err: any) {
        res.status(500).json({message: err.message || "Issue getting active workout day."})
    }
}