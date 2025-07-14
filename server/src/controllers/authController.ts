import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../models/userModel';

const saltRounds = 10; // Hashing rounds

export async function register(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required.'});
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await createUser(email, hashedPassword);

        res.status(201).json({message: 'User Created', user});
    } catch (error: any) {
        // PostgreSQL unique_violation
        if (error.code === '23505') {
            return res.status(409).json({message: 'Email already in use.'});
        }
        res.status(500).json({message: 'Something went wrong.', error: error.message});
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required.'});
        }

        const user = await findUserByEmail(email);
    } catch {
        
    }
}