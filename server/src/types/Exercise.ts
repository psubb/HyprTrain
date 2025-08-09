export interface Exercise {
    id: string;
    name: string;
    muscle_group_id: string;
    muscle_group_name?: string;
    user_id: string | null;
    is_default: boolean;
    is_deleted: boolean;
}