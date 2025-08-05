import { DailyNote } from "../types/DailyNote";
import pool from "../db/db";

export async function editDailyNote(id: string, dailyNote: string): Promise<DailyNote>{
    const result = await pool.query(
        `UPDATE daily_notes
        SET note = $1
        WHERE id = $2
        RETURNING *`,
        [dailyNote, id]
    );

    return result.rows[0];
}

export async function deleteDailyNote(id: string): Promise<DailyNote | null>{
    const result = await pool.query(
        `DELETE FROM daily_notes
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
}