CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE muscle_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    muscle_group_id UUID NOT NULL,
    user_id UUID,
    is_default BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (name, user_id)
);

CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    duration_weeks INTEGER NOT NULL CHECK (duration_weeks >= 4 AND duration_weeks <= 16),
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE workout_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 16),
    is_skipped BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_day_id UUID NOT NULL,
    exercise_id UUID NOT NULL,
    order_index INTEGER NOT NULL CHECK (order_index >= 0),
    FOREIGN KEY (workout_day_id) REFERENCES workout_days(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE exercise_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_exercise_id UUID NOT NULL,
    set_number INTEGER NOT NULL,
    FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
);

CREATE TABLE exercise_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_set_id UUID NOT NULL,
    reps INTEGER NOT NULL CHECK (reps >= 0),
    weight NUMERIC(4,1) NOT NULL CHECK (weight >= 0),
    rpe NUMERIC(3,1) DEFAULT NULL CHECK (rpe >= 0 AND rpe <= 10),
    FOREIGN KEY (exercise_set_id) REFERENCES exercise_sets(id) ON DELETE CASCADE
);

CREATE TABLE daily_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_day_id UUID NOT NULL,
    note TEXT,
    FOREIGN KEY (workout_day_id) REFERENCES workout_days(id) ON DELETE CASCADE
);

CREATE TABLE exercise_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_exercise_id UUID NOT NULL,
    note TEXT,
    FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
);

CREATE TYPE soreness_level AS ENUM ('Well Recovered', 'Slightly Sore', 'Very Sore');

CREATE TABLE soreness_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_day_id UUID NOT NULL,
    muscle_group_id UUID NOT NULL,
    level soreness_level,
    FOREIGN KEY (workout_day_id) REFERENCES workout_days(id) ON DELETE CASCADE,
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id)
);
