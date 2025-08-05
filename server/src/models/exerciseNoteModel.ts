import pool from "../db/db";
import { ExerciseNote } from "../types/ExerciseNote";

export async function createExerciseNote(exerciseId: string, note: string): Promise<ExerciseNote> {
    const result = await pool.query(
        `INSERT INTO exercise_notes (workout_exercise_id, note)
        VALUES ($1, $2)
        RETURNING *`,
        [exerciseId, note]
    );

    return result.rows[0];
}