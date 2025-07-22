import { insertProgram, countProgramsForUser } from "models/programModel";

export async function createProgram(userId: string, data: { name?: string; duration_weeks: number}) {
    const { name, duration_weeks } = data;
    const cleanName = name?.trim();
    let finalName: string;

    if (!cleanName){
        finalName = await generateDefaultProgramName(userId);
    } else {
        finalName = cleanName!;
    }

    const newProgram = await insertProgram(userId, finalName, duration_weeks);
    return newProgram;
}

export async function generateDefaultProgramName(userId: string): Promise<string> {
    const programNumber = await countProgramsForUser(userId);
    return `My Program ${programNumber + 1}`;
}