import pool from "../db/db";
import { MuscleGroup } from "../types/MuscleGroup";

export async function getAllMuscleGroups(): Promise<MuscleGroup[]> {
    const result = await pool.query(
        `SELECT id, name FROM muscle_groups ORDER BY name ASC`
    );
    
    return result.rows;
}
