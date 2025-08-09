import { Request, Response } from "express";
import { getAllMuscleGroups as getAllMuscleGroupsService } from "../services/muscleGroupService";

export async function getAllMuscleGroups(req: Request, res: Response) {
    try {
        const muscleGroups = await getAllMuscleGroupsService();
        res.status(200).json(muscleGroups);
    } catch (err: any) {
        res.status(500).json({ message: err.message || "Failed to fetch muscle groups" });
    }
}
