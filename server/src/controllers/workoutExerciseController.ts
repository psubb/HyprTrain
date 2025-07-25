import { Request, Response } from 'express';
import { populateExercisesAcrossWeeks } from '../services/workoutExerciseService';

export async function addExercisesToWorkoutDayTemplate(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId){
        res.status(401).json({message: 'Unauthorized: No user ID found.'});
        return;
    }

    const workoutDayId = req.params.id;
    const { dayOfWeek, exercises } = req.body;

    await populateExercisesAcrossWeeks(workoutDayId, dayOfWeek, exercises);

    res.status(201).json({message: 'Exercises inserted'});
}