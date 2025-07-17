import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../models/userModel';
import { DBUser } from '../types/User';
import validator from 'validator';

const saltRounds = 10; // Hashing rounds

export async function register(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({message: 'Email and password are required.'});
            return;
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1
            })
        ) {
            res.status(400).json({message: 'Password should be at least 8 characters and include 1 lowercase, 1 uppercase letter, and 1 number.'});
            return;
        }

        if (!validator.isEmail(email)) {
            res.status(400).json({message: 'Invalid email format.'});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user: DBUser = await createUser(email, hashedPassword);

        // Return all fields about user except for hashedPassword for security
        res.status(201).json({
            message: 'User Created',
            user: {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
            },
        });

    } catch (error: any) {
        // PostgreSQL unique_violation
        if (error.code === '23505') {
            res.status(409).json({message: 'Email already in use.'});
            return;
        }
        // TODO: Replace with logger before deploying to production?
        console.error('Register Error:', error); // Log full error message
        res.status(500).json({message: 'Something went wrong.', error: error?.message || 'Unknown error' });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({message: 'Email and password are required.'});
            return;
        }

        const user: DBUser | null = await findUserByEmail(email);

        if (!user) {
            res.status(401).json({message: 'Invalid credentials.'});
            return;
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            res.status(401).json({message: 'Invalid credentials.'});
            return;
        }
        // TODO: Create JWT token and implement functionality
        res.status(200).json({message: 'Successful Login!'});

    } catch (error: any){
        res.status(500).json({message: 'Something went wrong.', error: error.message});
    }
}