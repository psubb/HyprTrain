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

export async function getWorkoutExerciseContext(workoutExerciseId: string): Promise<{
    exercise_id: string;
    day_of_week: number;
    week_number: number;
    program_id: string;
  }>{
    const result = await pool.query(
        `SELECT we.exercise_id, wd.day_of_week, wd.week_number, wd.program_id
        FROM workout_exercises we
        JOIN workout_days wd ON we.workout_day_id = wd.id
        WHERE we.id = $1`,
        [workoutExerciseId]
    );
    if (!result.rows[0]){
        throw new Error('Workout exercise not found');
    }
    return result.rows[0];
}

export async function getWorkoutExerciseIdsForDays(workoutDayIds: string[], exerciseId: string){
    const result = await pool.query(
        `SELECT id FROM workout_exercises
        WHERE workout_day_id = ANY($1::uuid[]) AND exercise_id = $2`,
        [workoutDayIds, exerciseId]
    );

    return result.rows.map(row => row.id);
}