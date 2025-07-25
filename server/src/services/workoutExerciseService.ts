import { getProgramIdFromWorkoutDay, getWorkoutDaysByProgramAndDayOfWeek } from "../models/workoutDayModel";
import { insertWorkoutExercise } from "../models/workoutExerciseModel";
import { insertExerciseSet } from "../models/exerciseSetModel";

export async function populateExercisesAcrossWeeks(workoutDayId: string, dayOfWeek: number, exercises: { exerciseId: string; orderIndex: number; }[]) {
    const programId = await getProgramIdFromWorkoutDay(workoutDayId);
    const workoutDays = await getWorkoutDaysByProgramAndDayOfWeek(programId, dayOfWeek);

    for (const workoutDay of workoutDays){
        for (const exercise of exercises){
            const insertedWorkoutExerciseId = await insertWorkoutExercise(workoutDay.id, exercise.exerciseId, exercise.orderIndex);
            // Two default sets per exercise
            for (let i = 0; i < 2; i++){
                await insertExerciseSet(insertedWorkoutExerciseId.id, i + 1);
            }
        }
    }
}