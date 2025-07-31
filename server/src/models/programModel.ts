import pool from "../db/db";
import { Program } from "../types/Program";

export async function insertProgram(userId: string, name: string, duration_weeks: number) {
    await pool.query(
        `UPDATE programs SET is_active = FALSE WHERE user_id = $1;`,
        [userId]
    );

    const query = `
    INSERT INTO programs (user_id, name, duration_weeks, is_active)
    VALUES ($1, $2, $3, TRUE)
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

export async function getActiveProgramForUser(userId: string): Promise<Program | null>{
    const result = await pool.query(
        `SELECT * FROM programs
        WHERE user_id = $1 AND is_active = TRUE
        LIMIT 1`,
        [userId]
    );

    return result.rows[0] || null;
}