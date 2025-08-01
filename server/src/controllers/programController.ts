import { Request, Response } from 'express';
import { createProgram as createProgramService, getActiveProgram as getActiveProgramService} from '../services/programService';

export async function createProgram(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({message: 'Unauthorized: No user ID found.'});
        return;
    }

    const { name, duration_weeks } = req.body;

    if (typeof duration_weeks !== 'number' || duration_weeks < 4 || duration_weeks > 16) {
        res.status(400).json({message: 'duration_weeks must be a number between 4 to 16 weeks.'});
        return;
    }

    const program = await createProgramService(userId, { name, duration_weeks });

    res.status(201).json({message: 'Program created successfully', program});
}

export async function getActiveProgram(req: Request, res: Response){
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({message: 'Unauthorized: No user ID found.'});
        return;
    }

    try {
        const activeProgram = await getActiveProgramService(userId);
        res.status(200).json(activeProgram);
    } catch (err: any){
        res.status(500).json({message: err.message || "Error when trying to retrieve active program"});
    }
}