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
    WHERE name ILIKE $1 AND (user_id = $2 OR is_default = true) AND is_deleted = false`,
    [exerciseName, userId]
    );

    return result.rows[0] || null;
}

export async function checkExerciseInUse(exerciseId: string): Promise<boolean> {
    const result = await pool.query(
        `SELECT COUNT(*) as count FROM workout_exercises 
        WHERE exercise_id = $1`,
        [exerciseId]
    );
    
    return parseInt(result.rows[0].count) > 0;
}

export async function softDeleteExerciseById(userId: string, exerciseId: string): Promise<Exercise | null> {
    // Check if exercise is in use
    const inUse = await checkExerciseInUse(exerciseId);
    if (inUse) {
        throw new Error("Cannot delete exercise that is currently being used in workouts");
    }

    const result = await pool.query(
        `UPDATE exercises
        SET is_deleted = true
        WHERE id = $1 AND user_id = $2 AND is_deleted = false
        RETURNING *`,
        [exerciseId, userId]
    );

    return result.rows[0] || null;
}

export async function getCustomExercisesForUser(userId: string): Promise<Exercise[]>{
    const result = await pool.query(
        `SELECT * FROM exercises
        WHERE user_id = $1 AND is_deleted = false AND is_default = false
        ORDER BY name ASC`,
        [userId]
    );

    return result.rows;
}

export async function getExercisesByMuscleGroupForUser(userId: string, muscleGroupId: string): Promise<Exercise[]>{
    const result = await pool.query(
        `SELECT * FROM exercises
        where (user_id = $1 OR is_default = true) AND is_deleted = false AND muscle_group_id = $2
        ORDER BY name ASC`,
        [userId, muscleGroupId]
    );

    return result.rows;
}