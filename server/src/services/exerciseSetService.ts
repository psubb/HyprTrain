import { deleteExerciseSet as deleteExerciseSetService, getLastSetNumberForWorkoutExercise, insertExerciseSet } from "../models/exerciseSetModel";
import { ExerciseSet } from "../types/ExerciseSet";
import { getWorkoutExerciseContext, getWorkoutExerciseIdsForDays } from "../models/workoutExerciseModel";
import { getFutureWorkoutDayIds } from "../models/workoutDayModel";

export async function addExerciseSet(workoutExerciseId: string, propagate: boolean): Promise<ExerciseSet[]>{
    let newSets: ExerciseSet[] = [];
    // Add current week set
    const setNumber = await getLastSetNumberForWorkoutExercise(workoutExerciseId) + 1;
    newSets.push(await insertExerciseSet(workoutExerciseId, setNumber));
    
    if (propagate){
        const context = await getWorkoutExerciseContext(workoutExerciseId);
        const futureDays = await getFutureWorkoutDayIds(context.program_id, context.day_of_week, context.week_number);
        const futureWorkoutExerciseIds = await getWorkoutExerciseIdsForDays(futureDays, context.exercise_id);

        for (const weId of futureWorkoutExerciseIds){
            const nextSetNumber = await getLastSetNumberForWorkoutExercise(weId) + 1;
            const newSet = await insertExerciseSet(weId, nextSetNumber);
            newSets.push(newSet);
        }
    }
    return newSets;
}

export async function deleteLastExerciseSet(workoutExerciseId: string, propagate: boolean): Promise<ExerciseSet[]>{
    let deletedSets : ExerciseSet[] = [];
    // Delete this week set
    const lastSetNumber = await getLastSetNumberForWorkoutExercise(workoutExerciseId);
    deletedSets.push(await deleteExerciseSetService(workoutExerciseId, lastSetNumber));

    if (propagate){
        const context = await getWorkoutExerciseContext(workoutExerciseId);
        const futureDays = await getFutureWorkoutDayIds(context.program_id, context.day_of_week, context.week_number);
        const futureWorkoutExerciseIds = await getWorkoutExerciseIdsForDays(futureDays, context.exercise_id);
        
        for (const weId of futureWorkoutExerciseIds){
            const nextLastSetNumber = await getLastSetNumberForWorkoutExercise(weId);
            const deletedSet = await deleteExerciseSetService(weId, nextLastSetNumber);
            if (deletedSet){
                deletedSets.push(deletedSet);
            }
        }
    }

    return deletedSets;
}