import { getAllMuscleGroups as getAllMuscleGroupsModel } from "../models/muscleGroupModel";
import { MuscleGroup } from "../types/MuscleGroup";

export async function getAllMuscleGroups(): Promise<MuscleGroup[]> {
    return await getAllMuscleGroupsModel();
}
