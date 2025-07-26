export interface Exercise {
    id: string;
    name: string;
    muscle_group_id: string;
    user_id: string | null;
    is_default: boolean;
    is_deleted: boolean;
}