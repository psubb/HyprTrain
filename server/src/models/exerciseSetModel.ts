import pool from "../db/db";
import { ExerciseSet } from "../types/ExerciseSet";

export async function insertExerciseSet(workoutExerciseId: string, setNumber: number): Promise<ExerciseSet> {
    const query = `
    INSERT INTO exercise_sets (workout_exercise_id, set_number)
    VALUES ($1, $2)
    RETURNING *;
    `

    const values = [workoutExerciseId, setNumber];

    const results = await pool.query(query, values);

    return results.rows[0];
}

export async function getLastSetNumberForWorkoutExercise(workoutExerciseId: string): Promise<number> {
    const result = await pool.query(
        `SELECT MAX(set_number) AS max FROM exercise_sets
        WHERE workout_exercise_id = $1`,
        [workoutExerciseId]
    );
    
    const max = result.rows[0].max;
    return max !== null ? max : 0;
}

export async function deleteExerciseSet(workoutExerciseId: string, setNumber: number): Promise<ExerciseSet> {
    const result = await pool.query(
        `DELETE FROM exercise_sets
        WHERE workout_exercise_id = $1 AND set_number = $2
        RETURNING *`,
        [workoutExerciseId, setNumber]
    );

    return result.rows[0];
}