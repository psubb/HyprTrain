import pool from "../db/db"
import { Exercise } from "../types/Exercise"

export async function insertCustomExercise(userId: string, exerciseName: string, muscleGroupId: string): Promise<Exercise>{
    const result = await pool.query(
    `INSERT INTO exercises (name, muscle_group_id, user_id, is_default, is_deleted)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [exerciseName, muscleGroupId, userId, false, false]
);

    if (result.rows.length === 0){
        throw new Error("Failed to insert exercise");
    }

    return result.rows[0];
}

export async function findExerciseByNameForUser(userId: string, exerciseName: string): Promise<Exercise | null> {
    const result = await pool.query(
    `SELECT * FROM exercises
    WHERE name ILIKE $1 AND (user_id = $2 OR user_id IS NULL)`,
    [exerciseName, userId]
    );

    return result.rows[0] || null;
}