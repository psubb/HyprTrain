import pool from "../db/db";
import { WorkoutDay } from "../types/WorkoutDay";

export async function insertWorkoutDay(programId: string, dayOfWeek: number, weekNumber: number): Promise<WorkoutDay> {
    const query = `
    INSERT INTO workout_days (program_id, day_of_week, week_number)
    VALUES ($1, $2, $3)
    RETURNING *;
    `

    const values = [programId, dayOfWeek, weekNumber];

    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function activateFirstWorkoutDay(programId: string){
    await pool.query(
        `UPDATE workout_days
        SET is_active = TRUE
        WHERE id = (
            SELECT id from workout_days
            WHERE program_id = $1 AND is_completed = FALSE
            ORDER BY week_number ASC, day_of_week ASC
            LIMIT 1)`,
        [[programId]]
    );
}

export async function getProgramIdFromWorkoutDay(workoutDayID: string): Promise<string> {
    const query = `
    SELECT program_id
    FROM workout_days
    WHERE id = $1;
    `

    const values = [workoutDayID];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error('Workout day not found');
    }

    return result.rows[0].program_id;
}

export async function getWorkoutDaysByProgramAndDayOfWeek(programId: string, dayOfWeek: number): Promise<{ id: string }[]> {
    const query = `
    SELECT id
    FROM workout_days
    WHERE program_id = $1 AND day_of_week = $2;
    `

    const values = [programId, dayOfWeek];

    const result = await pool.query(query, values);

    return result.rows;
}