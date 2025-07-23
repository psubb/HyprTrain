import { Request, Response } from 'express';
import { createWorkoutDaysForProgram } from '../services/workoutDayService';

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