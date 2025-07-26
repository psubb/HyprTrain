import pool from "../db/db"
import { Exercise } from "../types/Exercise"

export async function insertCustomExercise(userId: string, exerciseName: string, muscleGroupId: string): Promise<Exercise>{
    const result = await pool.query(
    `INSERT INTO exercises (name, muscle_group_id, user_id, is_default, is_deleted)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [exerciseName, muscleGroupId, userId, false, false] 
    );

    return result.rows[0];
}