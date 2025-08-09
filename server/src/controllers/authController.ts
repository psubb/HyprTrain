import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../models/userModel';
import { DBUser } from '../types/User';
import { validateRegisterInput } from '../utils/validation';

const saltRounds = 10; // Hashing rounds
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export async function register(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({message: 'Email and password are required.'});
            return;
        }

        if (!validateRegisterInput(email, password)) {
            res.status(400).json({message: 'Invalid email or password format. Password must be at least 8 characters and include 1 lowercase, 1 uppercase letter, and 1 number.'});
            return;
        }

        // Check for JWT secret before proceeding
        if (!JWT_SECRET) {
            console.error('Register Error: Missing ACCESS_TOKEN_SECRET environment variable');
            res.status(500).json({message: 'Server configuration error.'});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user: DBUser = await createUser(email, hashedPassword);

        const token = jwt.sign({ userId: user.id}, JWT_SECRET, { expiresIn: '90m' });

        // Return all fields about user except for hashedPassword for security
        res.status(201).json({
            message: 'User Created',
            accessToken: token,
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
        
        // Enhanced error logging for production debugging
        console.error('Register Error:', {
            message: error?.message || 'Unknown error',
            code: error?.code,
            detail: error?.detail,
            stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
            timestamp: new Date().toISOString(),
        });
        
        res.status(500).json({
            message: 'Something went wrong.',
            error: process.env.NODE_ENV === 'development' ? error?.message : 'Internal server error'
        });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
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
        // TODO: Add refresh token if needed
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error('Missing ACCESS_TOKEN_SECRET in environment variable');
        }
        const accessToken = jwt.sign({userId: user.id}, JWT_SECRET, { expiresIn: '90m' });

        res.status(200).json({message: 'Successful Login!', accessToken, user: {id: user.id, email: user.email, created_at: user.created_at}});

    } catch (error: any){
        res.status(500).json({message: 'Something went wrong.', error: error.message});
    }
}