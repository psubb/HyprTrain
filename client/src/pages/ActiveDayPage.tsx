import { useEffect, useState } from "react";
import api from "@/api/http";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Program = {
  id: string;
  name: string;
  duration_weeks: number;
  is_active?: boolean;
  created_at?: string;
};

type ActiveDayMeta = {
  id: string;            // workout day id
  program_id: string;
  day_of_week: number;
  week_number: number;
  is_completed: boolean;
  is_active: boolean;
};

type SetLog = {
  reps: number;
  weight: number | null;
  rpe?: number | null;
  completed?: boolean;
};

type DaySet = {
  id: string;
  set_number: number;
  log?: SetLog | null;
  previous_log?: SetLog | null;
};

type DayExercise = {
  id: string;            // workout_exercise_id
  exercise_id: string;
  name: string;
  order_index: number;
  note?: string | null;
  sets: DaySet[];
};

type DayLog = {
  id: string;            // workout day id
  week_number: number;
  day_of_week: number;
  daily_note?: string | null;
  exercises: DayExercise[];
};

export default function ActiveDayPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [program, setProgram] = useState<Program | null>(null);
  const [activeDayMeta, setActiveDayMeta] = useState<ActiveDayMeta | null>(null);
  const [dayLog, setDayLog] = useState<DayLog | null>(null);
  
  // Edit states
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newDailyNote, setNewDailyNote] = useState("");
  const [editingExerciseNote, setEditingExerciseNote] = useState<string | null>(null);
  const [newExerciseNote, setNewExerciseNote] = useState("");
  const [savingWorkout, setSavingWorkout] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    setProgram(null);
    setActiveDayMeta(null);
    setDayLog(null);

    try {
      // 1) Active program
      const { data: activeProgram } = await api.get<Program>("/programs/active");
      if (!activeProgram?.id) {
        setProgram(null);
        return; // no program → CTA below
      }
      setProgram(activeProgram);

      // 2) Active day meta for that program
      const { data: activeDay } = await api.get<ActiveDayMeta>(
        `/programs/${activeProgram.id}/active-day`
      );
      setActiveDayMeta(activeDay);

      // 3) Full day log
      const { data: log } = await api.get<DayLog>(`/workout-days/${activeDay.id}/log`);
      setDayLog(log);
      setNewDailyNote(log.daily_note || "");
    } catch (e: any) {
      // 404 from active-day or log just means nothing active yet
      if (e?.response?.status === 404) {
        // leave program set (so we can show CTA), but no day/log
      } else {
        setError(e?.response?.data?.message || "Failed to load active day");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const dayLabel = (n: number) => {
    const map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const idx = Math.max(1, Math.min(7, n)) - 1;
    return map[idx];
  };

  const logSet = async (setId: string, reps: number, weight: number | null, rpe: number | null) => {
    try {
      await api.post(`/exercises-sets/${setId}/log`, {
        reps,
        weight,
        rpe
      });
      // Reload data to show updated log
      await loadData();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to log set");
    }
  };

  const addSet = async (workoutExerciseId: string) => {
    try {
      await api.post(`/workout-exercises/${workoutExerciseId}/sets`, {
        propagate: false
      });
      await loadData();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to add set");
    }
  };

  const removeLastSet = async (workoutExerciseId: string) => {
    try {
      await api.delete(`/workout-exercises/${workoutExerciseId}/sets/last`, {
        data: { propagate: false }
      });
      await loadData();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to remove set");
    }
  };

  const saveDailyNote = async () => {
    if (!dayLog) return;
    
    try {
      if (dayLog.daily_note) {
        // Update existing note - need to find the note ID first
        // For now, we'll create a new one if it doesn't exist
        await api.post(`/workout-days/${dayLog.id}/daily-note`, {
          note: newDailyNote
        });
      } else {
        // Create new note
        await api.post(`/workout-days/${dayLog.id}/daily-note`, {
          note: newDailyNote
        });
      }
      setEditingNote(null);
      await loadData();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save daily note");
    }
  };

  const saveExerciseNote = async (workoutExerciseId: string) => {
    try {
      await api.post(`/workout-exercises/${workoutExerciseId}/note`, {
        note: newExerciseNote
      });
      setEditingExerciseNote(null);
      setNewExerciseNote("");
      await loadData();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save exercise note");
    }
  };

  const completeWorkout = async () => {
    if (!activeDayMeta) return;
    
    setSavingWorkout(true);
    try {
      await api.patch(`/workout-days/${activeDayMeta.id}/complete`);
      navigate("/programs"); // Redirect to programs page after completion
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to complete workout");
      setSavingWorkout(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-32">Loading…</div>;
  if (error) return <div className="text-red-500 p-4 bg-red-50 border border-red-200 rounded">{error}</div>;

  // No active program → prompt to create one
  if (!program) {
    return (
      <div className="space-y-4 text-center p-8">
        <h1 className="text-2xl font-semibold">Today's Workout</h1>
        <p className="text-zinc-400">You don't have an active program yet.</p>
        <Button
          onClick={() => navigate("/programs/new")}
          className="bg-red-500 hover:bg-red-600"
        >
          Create a Program
        </Button>
      </div>
    );
  }

  // Program exists but no active day/log yet → soft empty state
  if (!activeDayMeta || !dayLog) {
    return (
      <div className="space-y-4 text-center p-8">
        <h1 className="text-2xl font-semibold">Today's Workout</h1>
        <p className="text-zinc-400">
          No active workout day found in <span className="font-medium">{program.name}</span>.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/programs")}
        >
          View Programs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Today's Workout</h1>
        <p className="text-zinc-400">
          {program.name} • Week {dayLog.week_number} • {dayLabel(dayLog.day_of_week)}
        </p>
      </div>

      {/* Daily Note Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Daily Note</h3>
          {!editingNote && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingNote("daily")}
            >
              {dayLog.daily_note ? "Edit" : "Add Note"}
            </Button>
          )}
        </div>
        
        {editingNote === "daily" ? (
          <div className="space-y-2">
            <Textarea
              value={newDailyNote}
              onChange={(e) => setNewDailyNote(e.target.value)}
              placeholder="How are you feeling today? Any notes about the workout?"
              className="bg-zinc-800 border-zinc-700"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveDailyNote}>
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingNote(null);
                  setNewDailyNote(dayLog.daily_note || "");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-300">
            {dayLog.daily_note || "No daily note added yet."}
          </p>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {dayLog.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onLogSet={logSet}
            onAddSet={addSet}
            onRemoveSet={removeLastSet}
            onSaveNote={saveExerciseNote}
            editingExerciseNote={editingExerciseNote}
            setEditingExerciseNote={setEditingExerciseNote}
            newExerciseNote={newExerciseNote}
            setNewExerciseNote={setNewExerciseNote}
          />
        ))}
      </div>

      {/* Complete Workout Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={completeWorkout}
          disabled={savingWorkout}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          {savingWorkout ? "Completing..." : "Complete Workout"}
        </Button>
      </div>
    </div>
  );
}

// Exercise Card Component
type ExerciseCardProps = {
  exercise: DayExercise;
  onLogSet: (setId: string, reps: number, weight: number | null, rpe: number | null) => void;
  onAddSet: (workoutExerciseId: string) => void;
  onRemoveSet: (workoutExerciseId: string) => void;
  onSaveNote: (workoutExerciseId: string) => void;
  editingExerciseNote: string | null;
  setEditingExerciseNote: (id: string | null) => void;
  newExerciseNote: string;
  setNewExerciseNote: (note: string) => void;
};

function ExerciseCard({
  exercise,
  onLogSet,
  onAddSet,
  onRemoveSet,
  onSaveNote,
  editingExerciseNote,
  setEditingExerciseNote,
  newExerciseNote,
  setNewExerciseNote
}: ExerciseCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
      {/* Exercise Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-lg">{exercise.name}</h3>
          {exercise.note && !editingExerciseNote && (
            <p className="text-xs text-zinc-400 mt-1">Note: {exercise.note}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingExerciseNote(exercise.id);
              setNewExerciseNote(exercise.note || "");
            }}
          >
            {exercise.note ? "Edit Note" : "Add Note"}
          </Button>
        </div>
      </div>

      {/* Exercise Note Editing */}
      {editingExerciseNote === exercise.id && (
        <div className="space-y-2">
          <Textarea
            value={newExerciseNote}
            onChange={(e) => setNewExerciseNote(e.target.value)}
            placeholder="Exercise-specific notes (form cues, adjustments, etc.)"
            className="bg-zinc-800 border-zinc-700"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onSaveNote(exercise.id)}>
              Save Note
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingExerciseNote(null);
                setNewExerciseNote("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Sets */}
      <div className="space-y-2">
        {exercise.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            onLogSet={onLogSet}
          />
        ))}
      </div>

      {/* Add/Remove Set Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSet(exercise.id)}
        >
          Add Set
        </Button>
        {exercise.sets.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemoveSet(exercise.id)}
          >
            Remove Last Set
          </Button>
        )}
      </div>
    </div>
  );
}

// Set Row Component
type SetRowProps = {
  set: DaySet;
  onLogSet: (setId: string, reps: number, weight: number | null, rpe: number | null) => void;
};

function SetRow({ set, onLogSet }: SetRowProps) {
  const [reps, setReps] = useState(set.log?.reps?.toString() || "");
  const [weight, setWeight] = useState(set.log?.weight?.toString() || "");
  const [rpe, setRpe] = useState(set.log?.rpe?.toString() || "");
  const [isLogging, setIsLogging] = useState(false);

  const handleLogSet = async () => {
    const repsNum = parseInt(reps);
    const weightNum = weight ? parseFloat(weight) : null;
    const rpeNum = rpe ? parseFloat(rpe) : null;

    if (isNaN(repsNum) || repsNum <= 0) {
      return; // Invalid reps
    }

    if (rpeNum !== null && (rpeNum < 0 || rpeNum > 10)) {
      return; // Invalid RPE
    }

    setIsLogging(true);
    try {
      await onLogSet(set.id, repsNum, weightNum, rpeNum);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="border border-zinc-800 rounded p-3 space-y-3">
      {/* Set Number and Previous Log */}
      <div className="flex justify-between items-center">
        <span className="font-medium">Set {set.set_number}</span>
        {set.previous_log && (
          <span className="text-xs text-zinc-500">
            Previous: {set.previous_log.reps} reps
            {set.previous_log.weight ? ` @ ${set.previous_log.weight}lbs` : ""}
            {set.previous_log.rpe ? ` (RPE ${set.previous_log.rpe})` : ""}
          </span>
        )}
      </div>

      {/* Current Log Display or Input Form */}
      {set.log?.completed ? (
        <div className="flex items-center justify-between">
          <span className="text-green-400">
            ✓ {set.log.reps} reps
            {set.log.weight ? ` @ ${set.log.weight}lbs` : ""}
            {set.log.rpe ? ` (RPE ${set.log.rpe})` : ""}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setReps(set.log?.reps?.toString() || "");
              setWeight(set.log?.weight?.toString() || "");
              setRpe(set.log?.rpe?.toString() || "");
            }}
          >
            Edit
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Reps</label>
              <Input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="0"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Weight (lbs)</label>
              <Input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">RPE (1-10)</label>
              <Input
                type="number"
                step="0.5"
                min="1"
                max="10"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                placeholder="7"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
          <Button
            onClick={handleLogSet}
            disabled={isLogging || !reps}
            size="sm"
            className="w-full"
          >
            {isLogging ? "Logging..." : "Log Set"}
          </Button>
        </div>
      )}
    </div>
  );
}
