import { activateFirstWorkoutDay, insertWorkoutDay, getActiveWorkoutDayForUser } from "../models/workoutDayModel";
import { WorkoutDay } from "../types/WorkoutDay";

export async function createWorkoutDaysForProgram(programId: string, daysOfWeek: number[], durationWeeks: number) {
    const insertPromises = [];
    
    for (let week = 1; week <= durationWeeks; week++){
        for (const day of daysOfWeek){
            insertPromises.push(insertWorkoutDay(programId, day, week));
        }
    }

    const results = await Promise.all(insertPromises);

    await activateFirstWorkoutDay(programId);

    return results;
}

export async function getActiveWorkoutDay(programId: string, userId: string): Promise<WorkoutDay | null>{
    const workoutDay = await getActiveWorkoutDayForUser(userId, programId);
    return workoutDay || null;
}