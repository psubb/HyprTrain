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