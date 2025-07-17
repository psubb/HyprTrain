CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Insert predefined muscle groups
INSERT INTO muscle_groups (id, name) VALUES
  (gen_random_uuid(), 'Chest'),
  (gen_random_uuid(), 'Back'),
  (gen_random_uuid(), 'Shoulders'),
  (gen_random_uuid(), 'Triceps'),
  (gen_random_uuid(), 'Biceps'),
  (gen_random_uuid(), 'Quads'),
  (gen_random_uuid(), 'Hamstrings'),
  (gen_random_uuid(), 'Glutes'),
  (gen_random_uuid(), 'Calves'),
  (gen_random_uuid(), 'Abs');

-- Insert default exercises
-- Chest
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Incline Barbell Bench (30 degrees)'),
  ('Incline Barbell Bench (45 degrees)'),
  ('Incline Dumbbell Bench (30 degrees)'),
  ('Incline Dumbbell Bench (45 degrees)'),
  ('Barbell Bench Press'),
  ('Flat Dumbbell Bench'),
  ('Chest Fly Machine'),
  ('Cable Crossover (High to Low)'),
  ('Cable Crossover (Low to High)'),
  ('Cable Crossover (Mid)')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Chest';

-- Back
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Barbell Row'),
  ('Pendlay Row'),
  ('Lat Pulldown (Close Grip)'),
  ('Lat Pulldown (Wide Grip)'),
  ('Lat Pulldown (Pronated Grip)'),
  ('Pull-Up'),
  ('Pull-Up (Neutral Grip)'),
  ('Chin-Up'),
  ('Cable Lat Pullover'),
  ('Cable Row (Wide Grip)'),
  ('Cable Row (Close Grip)')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Back';

-- Shoulders
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Dumbbell Lateral Raises'),
  ('Cable Lateral Raise'),
  ('Upright Row (Cable)'),
  ('Upright Row (EZ Bar)'),
  ('Dumbbell Shoulder Press (Seated)'),
  ('Dumbbell Shoulder Press (Standing)'),
  ('Cable Face Pulls'),
  ('Machine Rear Delt Fly'),
  ('Dumbbell Rear Delt Fly'),
  ('Dumbbell Front Raises')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Shoulders';

-- Triceps
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Dumbbell Overhead Tricep Extension'),
  ('Cable Overhead Tricep Extension'),
  ('Cable Tricep Pushdown'),
  ('Cable Tricep Extension'),
  ('Single Arm Cable Tricep Extension'),
  ('Skullcrushers')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Triceps';

-- Biceps
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Preacher Curl (EZ Bar)'),
  ('Preacher Curl (Dumbbell)'),
  ('Dumbbell Bicep Curl (Standing)'),
  ('Dumbbell Bicep Curl (Seated)'),
  ('Incline Dumbbell Bicep Curl'),
  ('EZ Bar Curl'),
  ('Cable Curl'),
  ('Bayesian Curl')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Biceps';

-- Quads
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Barbell Squat (Low-Bar)'),
  ('Barbell Squat (High-Bar)'),
  ('Leg Extensions'),
  ('Leg Press'),
  ('Goblet Squats'),
  ('Front Squats')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Quads';

-- Hamstrings
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Lying Hamstring Curl'),
  ('Seated Hamstring Curl'),
  ('Barbell Romanian Deadlift'),
  ('Dumbbell Romanian Deadlift'),
  ('Good Mornings'),
  ('Stiff Legged Deadlift')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Hamstrings';

-- Glutes
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Cable Glute Kickbacks'),
  ('Bulgarian Split Squats'),
  ('Barbell Hip Thrusts'),
  ('Machine Hip Thrusts'),
  ('Conventional Deadlift'),
  ('Sumo Deadlift'),
  ('Step Ups'),
  ('Lunges'),
  ('Machine Hip Abduction'),
  ('Single Leg Hip Thrusts')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Glutes';

-- Calves
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Seated Calf Raise Machine'),
  ('Standing Calf Raise Machine'),
  ('Smith Machine Calf Raise')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Calves';

-- Abs
INSERT INTO exercises (id, name, muscle_group_id, is_default)
SELECT gen_random_uuid(), exercise_name, mg.id, TRUE
FROM (VALUES
  ('Ab Machine')
) AS e(exercise_name)
JOIN muscle_groups mg ON mg.name = 'Abs';
