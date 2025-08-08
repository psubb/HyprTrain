import { ExerciseLog } from "../types/ExerciseLog";
import { logExerciseSet as logExerciseSetModel } from "../models/exerciseLogModel";
import pool from "../db/db";

export async function logExerciseSet(exerciseSetId: string, reps: number, weight: number, rpe: number | null): Promise<ExerciseLog>{
    // Validate sequential logging - check if previous sets are completed
    await validateSequentialLogging(exerciseSetId);
    
    return await logExerciseSetModel(exerciseSetId, reps, weight, rpe);
}

async function validateSequentialLogging(exerciseSetId: string): Promise<void> {
    // Get the set information and all sets for the same workout exercise
    const setInfoQuery = `
        SELECT es.set_number, es.workout_exercise_id
        FROM exercise_sets es
        WHERE es.id = $1
    `;
    
    const setInfoResult = await pool.query(setInfoQuery, [exerciseSetId]);
    if (setInfoResult.rows.length === 0) {
        throw new Error("Exercise set not found");
    }
    
    const { set_number, workout_exercise_id } = setInfoResult.rows[0];
    
    // Check if all previous sets are completed
    const previousSetsQuery = `
        SELECT es.id, es.set_number, 
               CASE WHEN el.id IS NOT NULL THEN true ELSE false END as is_logged
        FROM exercise_sets es
        LEFT JOIN exercise_logs el ON el.exercise_set_id = es.id AND el.is_completed = true
        WHERE es.workout_exercise_id = $1 AND es.set_number < $2
        ORDER BY es.set_number
    `;
    
    const previousSetsResult = await pool.query(previousSetsQuery, [workout_exercise_id, set_number]);
    
    // Check if any previous set is not logged
    const incompleteSet = previousSetsResult.rows.find(row => !row.is_logged);
    if (incompleteSet) {
        throw new Error(`Cannot log set ${set_number}. Complete set ${incompleteSet.set_number} first.`);
    }
}