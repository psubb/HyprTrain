export interface ExerciseLog {
    id: string;
    exercise_set_id: string;
    reps: number;
    weight: number;
    rpe: number | null;
    is_completed: boolean;
}