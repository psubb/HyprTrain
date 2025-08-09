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
        `SELECT e.*, mg.name as muscle_group_name FROM exercises e
        JOIN muscle_groups mg ON e.muscle_group_id = mg.id
        WHERE (e.user_id = $1 OR e.is_default = true) AND e.is_deleted = false AND e.muscle_group_id = $2
        ORDER BY e.name ASC`,
        [userId, muscleGroupId]
    );

    return result.rows;
}

export async function getAllExercisesForUser(userId: string): Promise<Exercise[]>{
    console.log('🔍 getAllExercisesForUser called with userId:', userId);
    
    // First, let's check what's in the exercises table
    const testResult = await pool.query(
        `SELECT COUNT(*) as total, 
         COUNT(CASE WHEN is_default = true THEN 1 END) as default_count,
         COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as user_count,
         COUNT(CASE WHEN is_deleted = true THEN 1 END) as deleted_count
         FROM exercises`
    );
    console.log('📈 Exercise table stats:', testResult.rows[0]);
    
    const result = await pool.query(
        `SELECT e.*, mg.name as muscle_group_name FROM exercises e
        JOIN muscle_groups mg ON e.muscle_group_id = mg.id
        WHERE (e.user_id = $1 OR e.is_default = true) AND e.is_deleted = false
        ORDER BY mg.name ASC, e.name ASC`,
        [userId]
    );
    console.log('📊 Database query returned:', result.rows.length, 'exercises');
    console.log('🔍 First few results:', result.rows.slice(0, 3));

    return result.rows;
}