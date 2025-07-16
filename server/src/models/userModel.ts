import { DBUser } from '../types/User';
import pool from '../db/db';

export async function createUser(email: string, passwordHash: string): Promise<DBUser> {
    const query = `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [email, passwordHash];

    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<DBUser | null> {
    const query = `
        SELECT * FROM users
        WHERE email = $1
        LIMIT 1;
    `;
    
    const values = [email];
    const result = await pool.query(query, values);

    return result.rows[0] ?? null;
}