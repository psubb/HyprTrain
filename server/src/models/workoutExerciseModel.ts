import pool from "../db/db";
import { WorkoutExercise } from "../types/WorkoutExercise";

export async function insertWorkoutExercise(workoutDayID: string, exerciseId: string, orderIndex: number): Promise<WorkoutExercise>{
    const query = `
    INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index)
    VALUES ($1, $2, $3)
    RETURNING *;
    `

    const values = [workoutDayID, exerciseId, orderIndex];
    const result = await pool.query(query, values);

    return result.rows[0];
}