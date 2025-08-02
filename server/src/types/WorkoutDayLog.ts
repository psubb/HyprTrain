export interface WorkoutDayLog {
    id: string;
    week_number: number;
    day_of_week: number;
    daily_note: string | null;
    exercises: WorkoutDayExerciseLog[];
  }
  
  export interface WorkoutDayExerciseLog {
    id: string; // workout_exercise_id
    exercise_id: string;
    name: string;
    order_index: number;
    note: string | null;
    sets: WorkoutDaySetLog[];
  }
  
  export interface WorkoutDaySetLog {
    id: string; // exercise_set_id
    set_number: number;
    log: ExerciseSetLog | null;
    previous_log: ExerciseSetLog | null;
  }
  
  export interface ExerciseSetLog {
    reps: number;
    weight: number;
    rpe: number | null;
    completed: boolean;
  }