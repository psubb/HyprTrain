-- Remove the old unique constraint
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_name_user_id_key;

-- Add a new unique constraint that only applies to non-deleted exercises
-- This allows users to recreate exercises with the same name after deleting them
CREATE UNIQUE INDEX exercises_name_user_id_not_deleted_unique 
ON exercises (name, user_id) 
WHERE is_deleted = false;
