import { DailyNote } from "../types/DailyNote";
import { activateNextWorkoutDay, insertWorkoutDay, getActiveWorkoutDayForUser, getWorkoutDayLog as getWorkoutDayLogModel, createDailyNote as createDailyNoteModel } from "../models/workoutDayModel";
import { WorkoutDay } from "../types/WorkoutDay";
import { WorkoutDayLog } from "../types/WorkoutDayLog";

export async function createWorkoutDaysForProgram(programId: string, daysOfWeek: number[], durationWeeks: number) {
    const insertPromises = [];
    
    for (let week = 1; week <= durationWeeks; week++){
        for (const day of daysOfWeek){
            insertPromises.push(insertWorkoutDay(programId, day, week));
        }
    }

    const results = await Promise.all(insertPromises);

    await activateNextWorkoutDay(programId);

    return results;
}

export async function getActiveWorkoutDay(programId: string, userId: string): Promise<WorkoutDay | null>{
    const activeWorkoutDay = await getActiveWorkoutDayForUser(userId, programId);
    return activeWorkoutDay || null;
}

export async function getWorkoutDayLog(userId: string, workoutDayId: string): Promise<WorkoutDayLog | null>{
    const workoutDayLog = await getWorkoutDayLogModel(userId, workoutDayId);
    return workoutDayLog || null;
}

export async function createDailyNote(workoutDayId: string, note: string): Promise<DailyNote> {
    const dailyNote = await createDailyNoteModel(workoutDayId, note);
    return dailyNote;
}