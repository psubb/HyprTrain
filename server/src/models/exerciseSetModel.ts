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