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

export async function editExerciseNote(id: string, note: string): Promise<ExerciseNote>{
    const result = await pool.query(
        `UPDATE exercise_notes
        SET note = $1
        WHERE id = $2
        RETURNING *`,
        [note, id]
    );

    return result.rows[0];
}