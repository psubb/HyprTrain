export interface WorkoutDay {
    id: string;
    program_id: string;
    day_of_week: number;
    week_number: number;
    is_skipped: boolean;
    is_completed: boolean;
}