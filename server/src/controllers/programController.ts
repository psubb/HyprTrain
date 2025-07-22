import { Request, Response } from 'express';
import { createProgram as createProgramService} from '../services/programService';

export async function createProgram(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({message: 'Unauthorized: No user ID found.'});
        return;
    }

    const { name, duration_weeks } = req.body;

    const program = await createProgramService(userId, { name, duration_weeks });

    res.status(201).json({message: 'Program created successfully', program});
}