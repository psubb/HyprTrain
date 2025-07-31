import { activateFirstWorkoutDay, insertWorkoutDay } from "../models/workoutDayModel";

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