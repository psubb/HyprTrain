import pool from "../db/db";
import { ExerciseLog } from "../types/ExerciseLog";

export async function logExerciseSet(exerciseSetId: string, reps: number, weight: number, rpe: number | null): Promise<ExerciseLog>{
    const result = await pool.query(
        `INSERT INTO exercise_logs (exercise_set_id, reps, weight, rpe, is_completed)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [exerciseSetId, reps, weight, rpe, true]
    );

    return result.rows[0];
}