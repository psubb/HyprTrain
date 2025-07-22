import pool from "../db/db";

export async function insertProgram(userId: string, name: string, duration_weeks: number) {
    const query = `
    INSERT INTO programs (user_id, name, duration_weeks)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;

    const values = [userId, name, duration_weeks];

    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function countProgramsForUser(userId: string): Promise<number> {
    const query = `
    SELECT COUNT(*)
    FROM programs
    WHERE user_id = $1;
    `

    const values = [userId];

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
}