import { WorkoutDayLog, ExerciseSetLog, WorkoutDayExerciseLog, WorkoutDaySetLog } from "../types/WorkoutDayLog";
import pool from "../db/db";
import { WorkoutDay } from "../types/WorkoutDay";

export async function insertWorkoutDay(programId: string, dayOfWeek: number, weekNumber: number): Promise<WorkoutDay> {
    const query = `
    INSERT INTO workout_days (program_id, day_of_week, week_number)
    VALUES ($1, $2, $3)
    RETURNING *;
    `

    const values = [programId, dayOfWeek, weekNumber];

    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function activateNextWorkoutDay(programId: string){
    await pool.query(
        `UPDATE workout_days
        SET is_active = TRUE
        WHERE id = (
            SELECT id from workout_days
            WHERE program_id = $1 AND is_completed = FALSE
            ORDER BY week_number ASC, day_of_week ASC
            LIMIT 1
        )`,
        [programId]
    );
}

export async function getProgramIdFromWorkoutDay(workoutDayID: string): Promise<string> {
    const query = `
    SELECT program_id
    FROM workout_days
    WHERE id = $1;
    `

    const values = [workoutDayID];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error('Workout day not found');
    }

    return result.rows[0].program_id;
}

export async function getWorkoutDaysByProgramAndDayOfWeek(programId: string, dayOfWeek: number): Promise<{ id: string }[]> {
    const query = `
    SELECT id
    FROM workout_days
    WHERE program_id = $1 AND day_of_week = $2;
    `

    const values = [programId, dayOfWeek];

    const result = await pool.query(query, values);

    return result.rows;
}

export async function getActiveWorkoutDayForUser(userId: string, programId: string): Promise<WorkoutDay| null>{
    const result = await pool.query(
        `SELECT wd.*
        FROM workout_days wd
        JOIN programs p ON wd.program_id = p.id
        WHERE wd.program_id = $1 AND p.user_id = $2 AND wd.is_active = TRUE
        LIMIT 1`,
        [programId, userId]
    );

    return result.rows[0] || null;
}

export async function getWorkoutDayLog(userId: string, workoutDayId: string): Promise<WorkoutDayLog | null> {
    // Step 1: Get workout_day, daily_note, and basic day info
  const dayResult = await pool.query(
    `
    SELECT wd.id, wd.week_number, wd.day_of_week, dn.note AS daily_note, wd.program_id
    FROM workout_days wd
    LEFT JOIN daily_notes dn ON dn.workout_day_id = wd.id
    JOIN programs p ON wd.program_id = p.id
    WHERE wd.id = $1 AND p.user_id = $2
    `,
    [workoutDayId, userId]
  );

  const day = dayResult.rows[0];
  if (!day) return null;

  const { week_number, day_of_week, program_id } = day;

  // Step 2: Get exercises, sets, current logs, and notes
  const exResult = await pool.query(
    `
    SELECT
      we.id AS workout_exercise_id,
      we.exercise_id,
      we.order_index,
      e.name AS exercise_name,
      en.note AS exercise_note,
      es.id AS set_id,
      es.set_number,
      el.reps,
      el.weight,
      el.rpe,
      el.is_completed
    FROM workout_exercises we
    JOIN exercises e ON e.id = we.exercise_id
    LEFT JOIN exercise_notes en ON en.workout_exercise_id = we.id
    JOIN exercise_sets es ON es.workout_exercise_id = we.id
    LEFT JOIN exercise_logs el ON el.exercise_set_id = es.id
    WHERE we.workout_day_id = $1
    ORDER BY we.order_index, es.set_number
    `,
    [workoutDayId]
  );

  const exerciseMap = new Map<string, WorkoutDayExerciseLog>();

  for (const row of exResult.rows) {
    const exId = row.workout_exercise_id;
    if (!exerciseMap.has(exId)) {
      exerciseMap.set(exId, {
        id: exId,
        exercise_id: row.exercise_id,
        name: row.exercise_name,
        order_index: row.order_index,
        note: row.exercise_note,
        sets: [],
      });
    }

    const log: ExerciseSetLog | null = row.reps !== null ? {
      reps: row.reps,
      weight: parseFloat(row.weight),
      rpe: row.rpe !== null ? parseFloat(row.rpe) : null,
      completed: row.is_completed,
    } : null;

    const set: WorkoutDaySetLog = {
      id: row.set_id,
      set_number: row.set_number,
      log,
      previous_log: null, // will fill later
    };

    exerciseMap.get(exId)!.sets.push(set);
  }

  // Step 3: Attach previous logs if not week 1
  if (week_number > 1) {
    const prevDayResult = await pool.query(
      `
      SELECT wd.id FROM workout_days wd
      WHERE wd.program_id = $1 AND wd.week_number = $2 AND wd.day_of_week = $3
      `,
      [program_id, week_number - 1, day_of_week]
    );

    const prevDay = prevDayResult.rows[0];
    if (prevDay) {
      const prevLogsResult = await pool.query(
        `
        SELECT
          we.exercise_id,
          es.set_number,
          el.reps,
          el.weight,
          el.rpe,
          el.is_completed
        FROM workout_exercises we
        JOIN exercise_sets es ON es.workout_exercise_id = we.id
        JOIN exercise_logs el ON el.exercise_set_id = es.id
        WHERE we.workout_day_id = $1
        `,
        [prevDay.id]
      );

      // Map logs by composite key: `${exercise_id}-${set_number}`
      const prevLogMap = new Map<string, ExerciseSetLog>();
      for (const row of prevLogsResult.rows) {
        prevLogMap.set(`${row.exercise_id}-${row.set_number}`, {
          reps: row.reps,
          weight: parseFloat(row.weight),
          rpe: row.rpe !== null ? parseFloat(row.rpe) : null,
          completed: row.is_completed,
        });
      }

      // Attach previous_log to matching sets
      for (const ex of exerciseMap.values()) {
        for (const set of ex.sets) {
          const key = `${ex.exercise_id}-${set.set_number}`;
          if (prevLogMap.has(key)) {
            set.previous_log = prevLogMap.get(key)!;
          }
        }
      }
    }
  }

  // Final structure
  const result: WorkoutDayLog = {
    id: workoutDayId,
    week_number: day.week_number,
    day_of_week: day.day_of_week,
    daily_note: day.daily_note,
    exercises: Array.from(exerciseMap.values()),
  };

  return result;
}