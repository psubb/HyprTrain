import pool from "../db/db";

export async function insertWorkoutDay(programId: string, dayOfWeek: number, weekNumber: number) {
    const query = `
    INSERT INTO workout_days (program_id, day_of_week, week_number)
    VALUES ($1, $2, $3)
    RETURNING *;
    `

    const values = [programId, dayOfWeek, weekNumber];

    const result = await pool.query(query, values);
    return result.rows[0];
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