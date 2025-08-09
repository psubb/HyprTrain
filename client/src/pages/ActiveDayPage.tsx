import { useEffect, useState } from "react";
import api from "@/api/http";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showToast } from "@/components/ui/toast";

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
  muscle_group_name: string;
  order_index: number;
  note?: string | null;
  sets: DaySet[];
};

type DayLog = {
  id: string;            // workout day id
  week_number: number;
  day_of_week: number;
  daily_note?: string | null;
  daily_note_id?: string | null; // Add daily note ID for updates
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
  
  // Dialog states
  const [showAddSetDialog, setShowAddSetDialog] = useState(false);
  const [showRemoveSetDialog, setShowRemoveSetDialog] = useState(false);
  const [showCompleteWorkoutDialog, setShowCompleteWorkoutDialog] = useState(false);
  const [pendingSetAction, setPendingSetAction] = useState<{
    workoutExerciseId: string;
    action: 'add' | 'remove';
  } | null>(null);

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
      console.log('Day log data:', log); // Debug: Check if muscle_group_name is present
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
    const idx = Math.max(0, Math.min(6, n));
    return map[idx];
  };

  const logSet = async (setId: string, reps: number, weight: number | null, rpe: number | null) => {
    try {
      await api.post(`/exercise-sets/${setId}/log`, {
        reps,
        weight,
        rpe
      });
      
      // Update local state instead of reloading everything
      if (dayLog) {
        const updatedDayLog = {
          ...dayLog,
          exercises: dayLog.exercises.map(exercise => ({
            ...exercise,
            sets: exercise.sets.map(set => 
              set.id === setId 
                ? {
                    ...set,
                    log: {
                      reps,
                      weight,
                      rpe,
                      completed: true
                    }
                  }
                : set
            )
          }))
        };
        setDayLog(updatedDayLog);
      }
      
      // Show success toast
      const weightText = weight ? ` @ ${weight}lbs` : '';
      const rpeText = rpe ? ` (RPE ${rpe})` : '';
      showToast.success(`Set logged: ${reps} reps${weightText}${rpeText}`);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || "Failed to log set";
      setError(errorMsg);
      showToast.error(errorMsg);
    }
  };

  const addSet = async (workoutExerciseId: string, propagate: boolean = false) => {
    try {
      const response = await api.post(`/workout-exercises/${workoutExerciseId}/sets`, {
        propagate
      });
      
      // Update local state with the new set (response.data is an array, we need the first one)
      if (dayLog && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const newSet = response.data[0]; // Take the first set (current workout)
        const updatedDayLog = {
          ...dayLog,
          exercises: dayLog.exercises.map(exercise => 
            exercise.id === workoutExerciseId
              ? {
                  ...exercise,
                  sets: [...exercise.sets, {
                    id: newSet.id,
                    set_number: newSet.set_number,
                    log: null,
                    previous_log: null
                  }]
                }
              : exercise
          )
        };
        setDayLog(updatedDayLog);
      }
      
      // Show success toast
      const propagateText = propagate ? " (applied to all future workouts)" : "";
      showToast.success(`Set added successfully${propagateText}`);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || "Failed to add set";
      setError(errorMsg);
      showToast.error(errorMsg);
    }
  };

  const removeLastSet = async (workoutExerciseId: string, propagate: boolean = false) => {
    try {
      const config = {
        method: 'delete',
        url: `/workout-exercises/${workoutExerciseId}/sets`,
        data: { propagate }
      };
      await api.request(config);
      
      // Update local state by removing the last set
      if (dayLog) {
        const updatedDayLog = {
          ...dayLog,
          exercises: dayLog.exercises.map(exercise => 
            exercise.id === workoutExerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.slice(0, -1) // Remove the last set
                }
              : exercise
          )
        };
        setDayLog(updatedDayLog);
      }
      
      // Show success toast
      const propagateText = propagate ? " (applied to all future workouts)" : "";
      showToast.success(`Set removed successfully${propagateText}`);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || "Failed to remove set";
      setError(errorMsg);
      showToast.error(errorMsg);
    }
  };

  const handleAddSetClick = (workoutExerciseId: string) => {
    setPendingSetAction({ workoutExerciseId, action: 'add' });
    setShowAddSetDialog(true);
  };

  const handleRemoveSetClick = (workoutExerciseId: string) => {
    setPendingSetAction({ workoutExerciseId, action: 'remove' });
    setShowRemoveSetDialog(true);
  };

  const confirmAddSet = async (propagate: boolean) => {
    if (pendingSetAction?.action === 'add') {
      await addSet(pendingSetAction.workoutExerciseId, propagate);
    }
    setShowAddSetDialog(false);
    setPendingSetAction(null);
  };

  const confirmRemoveSet = async (propagate: boolean) => {
    if (pendingSetAction?.action === 'remove') {
      await removeLastSet(pendingSetAction.workoutExerciseId, propagate);
    }
    setShowRemoveSetDialog(false);
    setPendingSetAction(null);
  };

  const saveDailyNote = async () => {
    if (!dayLog) return;
    
    try {
      let dailyNoteId = dayLog.daily_note_id;
      const isUpdate = !!dayLog.daily_note_id;
      
      if (dayLog.daily_note_id) {
        // Update existing note using PATCH
        await api.patch(`/daily-notes/${dayLog.daily_note_id}`, {
          note: newDailyNote
        });
      } else {
        // Create new note using POST
        const response = await api.post(`/workout-days/${dayLog.id}/daily-note`, {
          note: newDailyNote
        });
        dailyNoteId = response.data?.id;
      }
      
      // Update local state instead of reloading
      setDayLog({
        ...dayLog,
        daily_note: newDailyNote,
        daily_note_id: dailyNoteId
      });
      setEditingNote(null);
      
      // Show success toast
      showToast.success(`Daily note ${isUpdate ? 'updated' : 'added'} successfully`);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || "Failed to save daily note";
      setError(errorMsg);
      showToast.error(errorMsg);
    }
  };

  const saveExerciseNote = async (workoutExerciseId: string) => {
    try {
      // Find the current exercise to determine if it's an update or new note
      const currentExercise = dayLog?.exercises.find(ex => ex.id === workoutExerciseId);
      const isUpdate = !!currentExercise?.note;
      
      await api.post(`/workout-exercises/${workoutExerciseId}/note`, {
        note: newExerciseNote
      });
      
      // Update local state instead of reloading
      if (dayLog) {
        const updatedDayLog = {
          ...dayLog,
          exercises: dayLog.exercises.map(exercise => 
            exercise.id === workoutExerciseId
              ? {
                  ...exercise,
                  note: newExerciseNote
                }
              : exercise
          )
        };
        setDayLog(updatedDayLog);
      }
      
      setEditingExerciseNote(null);
      setNewExerciseNote("");
      
      // Show success toast
      showToast.success(`Exercise note ${isUpdate ? 'updated' : 'added'} successfully`);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || "Failed to save exercise note";
      setError(errorMsg);
      showToast.error(errorMsg);
    }
  };

  const handleCompleteWorkoutClick = () => {
    setShowCompleteWorkoutDialog(true);
  };

  const confirmCompleteWorkout = async () => {
    if (!activeDayMeta) return;
    
    setShowCompleteWorkoutDialog(false);
    setSavingWorkout(true);
    try {
      await api.patch(`/workout-days/${activeDayMeta.id}/complete`);
      // Reload data to get the next active day instead of navigating away
      await loadData();
      
      // Show success toast
      showToast.success("Workout completed successfully! 🎉");
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || "Failed to complete workout";
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-gray-950 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
      
      <div className="relative max-w-4xl mx-auto p-4 sm:p-8 space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12 px-2">
          <div className="inline-flex items-center px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs sm:text-sm font-medium backdrop-blur-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            ACTIVE SESSION
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
              Today's <span className="font-semibold text-red-400">Training</span>
            </h1>
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 text-gray-400">
              <span className="text-white font-medium text-base sm:text-lg text-center">{program.name}</span>
              <div className="flex items-center gap-2 sm:gap-3 text-sm">
                <span>Week {dayLog.week_number}</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span>{dayLabel(dayLog.day_of_week)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Note Card */}
        <Card className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl mx-2 sm:mx-0">
          <CardHeader className="border-b border-gray-800/50 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2 sm:gap-3 text-white">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Daily Note
              </CardTitle>
              {!editingNote && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800/50 text-xs sm:text-sm font-medium transition-colors duration-200 px-2 sm:px-3"
                  onClick={() => setEditingNote("daily")}
                >
                  {dayLog.daily_note ? "Edit" : "Add Note"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {editingNote === "daily" ? (
              <div className="space-y-4">
                <Textarea
                  value={newDailyNote}
                  onChange={(e) => setNewDailyNote(e.target.value)}
                  placeholder="How are you feeling today? Any notes about the workout?"
                  className="min-h-[80px] resize-none bg-gray-950/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 rounded-lg"
                />
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    size="sm" 
                    onClick={saveDailyNote} 
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 transition-colors duration-200 w-full sm:w-auto"
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-800/50 font-medium w-full sm:w-auto"
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
              <p className="text-gray-300 leading-relaxed">
                {dayLog.daily_note || "No daily note added yet."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Exercises Grid */}
        <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
          <div className="text-center space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-white">
              Exercise <span className="font-medium text-red-400">Log</span>
            </h2>
            <div className="w-12 h-px bg-red-500/30 mx-auto"></div>
          </div>
          {dayLog.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              exerciseNumber={index + 1}
              onLogSet={logSet}
              onAddSet={handleAddSetClick}
              onRemoveSet={handleRemoveSetClick}
              onSaveNote={saveExerciseNote}
              editingExerciseNote={editingExerciseNote}
              setEditingExerciseNote={setEditingExerciseNote}
              newExerciseNote={newExerciseNote}
              setNewExerciseNote={setNewExerciseNote}
            />
          ))}
        </div>

        {/* Complete Workout Section */}
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="max-w-sm mx-auto space-y-4 sm:space-y-6">
            <div className="text-gray-400 font-medium text-sm sm:text-base">
              Ready to finish your workout?
            </div>
            <Button
              onClick={handleCompleteWorkoutClick}
              disabled={savingWorkout}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium tracking-wide transition-all duration-200 w-full disabled:opacity-50"
            >
              {savingWorkout ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                  Completing...
                </>
              ) : (
                "Complete Workout"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Add Set Dialog */}
      <Dialog open={showAddSetDialog} onOpenChange={setShowAddSetDialog}>
        <DialogContent className="mx-2 sm:mx-4 max-w-md w-[calc(100vw-1rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">Add Set</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm md:text-base leading-relaxed">
              Would you like to add this set to just this workout, or propagate it to all future workouts for this exercise on the same day of the week?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-3 sm:flex-row sm:gap-2">
            <Button
              variant="outline"
              onClick={() => confirmAddSet(false)}
              className="w-full order-2 sm:order-1 sm:w-auto text-sm"
            >
              Just This Workout
            </Button>
            <Button
              onClick={() => confirmAddSet(true)}
              className="w-full order-1 sm:order-2 sm:w-auto text-sm"
            >
              All Future Workouts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Set Dialog */}
      <Dialog open={showRemoveSetDialog} onOpenChange={setShowRemoveSetDialog}>
        <DialogContent className="mx-2 sm:mx-4 max-w-md w-[calc(100vw-1rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">Remove Set</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm md:text-base leading-relaxed">
              Would you like to remove the last set from just this workout, or from all future workouts for this exercise on the same day of the week?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-3 sm:flex-row sm:gap-2">
            <Button
              variant="outline"
              onClick={() => confirmRemoveSet(false)}
              className="w-full order-2 sm:order-1 sm:w-auto text-sm"
            >
              Just This Workout
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmRemoveSet(true)}
              className="w-full order-1 sm:order-2 sm:w-auto text-sm"
            >
              All Future Workouts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Workout Confirmation Dialog */}
      <Dialog open={showCompleteWorkoutDialog} onOpenChange={setShowCompleteWorkoutDialog}>
        <DialogContent className="mx-2 sm:mx-4 max-w-md w-[calc(100vw-1rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">Complete Workout?</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm md:text-base leading-relaxed">
              Are you sure you want to complete this workout? This action will mark all exercises as finished and move you to the next workout day.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-3 sm:flex-row sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCompleteWorkoutDialog(false)}
              className="w-full order-2 sm:order-1 sm:w-auto text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmCompleteWorkout}
              disabled={savingWorkout}
              className="w-full order-1 sm:order-2 sm:w-auto text-sm bg-red-500 hover:bg-red-600"
            >
              {savingWorkout ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Completing...
                </>
              ) : (
                "Complete Workout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Exercise Card Component
type ExerciseCardProps = {
  exercise: DayExercise;
  exerciseNumber: number;
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
  exerciseNumber: _exerciseNumber,
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
    <Card className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl overflow-hidden mx-2 sm:mx-0">
      <CardHeader className="border-b border-gray-800/50 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-medium text-white leading-tight">
              {exercise.name}
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {exercise.muscle_group_name || 'Unknown muscle group'}
            </p>
            {exercise.note && editingExerciseNote !== exercise.id && (
              <p className="text-xs sm:text-sm text-gray-400 mt-2 bg-gray-800/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-700/50 break-words">
                {exercise.note}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 text-xs sm:text-sm font-medium transition-colors duration-200 px-2 sm:px-3 py-1.5 sm:py-2 flex-shrink-0"
            onClick={() => {
              setEditingExerciseNote(exercise.id);
              setNewExerciseNote(exercise.note || "");
            }}
          >
            {exercise.note ? "Edit" : "Add Note"}
          </Button>
        </div>

        {/* Exercise Note Editing */}
        {editingExerciseNote === exercise.id && (
          <div className="space-y-4 pt-4 border-t border-gray-800/50">
            <Textarea
              value={newExerciseNote}
              onChange={(e) => setNewExerciseNote(e.target.value)}
              placeholder="Exercise-specific notes (form cues, adjustments, etc.)"
              className="min-h-[60px] resize-none bg-gray-950/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 rounded-lg"
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                size="sm" 
                onClick={() => onSaveNote(exercise.id)} 
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 sm:px-4 py-2 transition-colors duration-200 w-full sm:w-auto text-sm"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 font-medium w-full sm:w-auto text-sm"
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
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Sets Grid */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {exercise.sets.map((set, index) => {
              // Check if previous sets are completed to determine if this set can be logged
              const previousSetsCompleted = exercise.sets
                .slice(0, index)
                .every(prevSet => prevSet.log?.completed === true);
              
              const isBlocked = !(index === 0 || previousSetsCompleted) && !set.log?.completed;
              
              return (
                <SetRow
                  key={set.id}
                  set={set}
                  setNumber={index + 1}
                  onLogSet={onLogSet}
                  isBlocked={isBlocked}
                />
              );
            })}
          </div>

          {/* Add/Remove Set Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-800/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddSet(exercise.id)}
              className="flex-1 bg-gray-800/30 hover:bg-red-500/20 text-gray-300 hover:text-white border-gray-700 hover:border-red-500/50 font-medium py-2.5 sm:py-3 transition-all duration-200 text-sm"
            >
              + Add Set
            </Button>
            {exercise.sets.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveSet(exercise.id)}
                className="flex-1 bg-gray-800/30 hover:bg-red-500/20 text-gray-300 hover:text-white border-gray-700 hover:border-red-500/50 font-medium py-2.5 sm:py-3 transition-all duration-200 text-sm"
              >
                Remove Set
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Set Row Component
type SetRowProps = {
  set: DaySet;
  setNumber: number;
  onLogSet: (setId: string, reps: number, weight: number | null, rpe: number | null) => void;
  isBlocked: boolean; // Whether this set is blocked by incomplete previous sets
};

function SetRow({ set, setNumber, onLogSet, isBlocked }: SetRowProps) {
  // Pre-select previous values if available, otherwise use logged values, otherwise start empty
  const [reps, setReps] = useState(
    set.log?.reps?.toString() || 
    set.previous_log?.reps?.toString() || 
    ""
  );
  const [weight, setWeight] = useState(
    set.log?.weight?.toString() || 
    set.previous_log?.weight?.toString() || 
    ""
  );
  const [rpe, setRpe] = useState(
    set.log?.rpe?.toString() || 
    set.previous_log?.rpe?.toString() || 
    ""
  );
  const [isLogging, setIsLogging] = useState(false);

  // Get previous week's values for highlighting/positioning
  const previousReps = set.previous_log?.reps?.toString();
  const previousWeight = set.previous_log?.weight?.toString();
  const previousRpe = set.previous_log?.rpe?.toString();

  // Generate weight options in 2.5lb increments
  const generateWeightOptions = () => {
    const options = [];
    for (let i = 0; i <= 500; i += 2.5) {
      options.push(i);
    }
    return options;
  };

  // Generate rep options (1-50)
  const generateRepOptions = () => {
    const options = [];
    for (let i = 1; i <= 50; i++) {
      options.push(i);
    }
    return options;
  };

  // Generate RPE options (1-10 in 0.5 increments)
  const generateRPEOptions = () => {
    const options = [];
    for (let i = 1; i <= 10; i += 0.5) {
      options.push(i);
    }
    return options;
  };

  const handleLogSet = async () => {
    const repsNum = parseInt(reps);
    const weightNum = weight ? parseFloat(weight) : null;
    const rpeNum = rpe ? parseFloat(rpe) : null;

    // Validation: Both reps and weight are required
    if (isNaN(repsNum) || repsNum <= 0) {
      return; // Invalid reps
    }

    if (weightNum === null || isNaN(weightNum) || weightNum < 0) {
      return; // Invalid weight - weight is now required
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
    <div className={`bg-gray-800/20 rounded-xl p-3 sm:p-5 border transition-all duration-200 ${
      isBlocked 
        ? 'border-gray-700/50 opacity-60' 
        : 'border-gray-700/30 hover:border-gray-600/50'
    }`}>
      {/* Set Header */}
      <div className="flex flex-col gap-3 mb-4 sm:mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`flex items-center justify-center w-16 h-7 sm:w-20 sm:h-8 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
              isBlocked 
                ? 'bg-gray-600/30 border border-gray-600/50 text-gray-400' 
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}>
              Set {setNumber}
            </div>
          </div>
        </div>
        {isBlocked && (
          <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full self-start">
            Complete previous sets first
          </span>
        )}
        {set.previous_log && (
          <div className="text-xs text-gray-400 bg-gray-800/30 border border-gray-700/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium break-words">
            Previous: {set.previous_log.reps} reps
            {set.previous_log.weight ? ` @ ${set.previous_log.weight}lbs` : ""}
            {set.previous_log.rpe ? ` (RPE ${set.previous_log.rpe})` : ""}
          </div>
        )}
      </div>

      {/* Current Log Display or Input Form */}
      {set.log?.completed ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
              <span className="font-medium text-white text-sm sm:text-base break-words">
                {set.log.reps} reps
                {set.log.weight ? ` @ ${set.log.weight}lbs` : ""}
                {set.log.rpe ? ` (RPE ${set.log.rpe})` : ""}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-white hover:bg-red-500/20 text-xs sm:text-sm font-medium transition-colors duration-200 px-2 sm:px-3 py-1.5 sm:py-2 flex-shrink-0"
              onClick={() => {
                setReps(set.log?.reps?.toString() || "");
                setWeight(set.log?.weight?.toString() || "");
                setRpe(set.log?.rpe?.toString() || "");
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {isBlocked && (
            <div className="text-center py-2 sm:py-3">
              <p className="text-gray-400 text-xs sm:text-sm">
                🔒 Complete Set {setNumber - 1} before logging this set
              </p>
            </div>
          )}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 ${isBlocked ? 'pointer-events-none opacity-50' : ''}`}>
            {/* Reps Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
                Reps
              </label>
              <Select value={reps} onValueChange={setReps} disabled={isBlocked}>
                <SelectTrigger className={`bg-gray-950/50 border-gray-700 text-white transition-all duration-200 h-10 sm:h-auto ${
                  isBlocked ? 'cursor-not-allowed' : 'hover:border-red-500/50 focus:border-red-500/50'
                }`}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {generateRepOptions().map((repOption) => {
                    const isPrevious = previousReps === repOption.toString();
                    return (
                      <SelectItem 
                        key={repOption} 
                        value={repOption.toString()} 
                        className={`text-white hover:bg-red-500/20 focus:bg-red-500/20 ${
                          isPrevious ? 'bg-red-500/10 border-l-2 border-red-500 font-medium' : ''
                        }`}
                      >
                        {repOption} {isPrevious ? '← Previous' : ''}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Weight Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
                Weight (lbs)
              </label>
              <Select value={weight} onValueChange={setWeight} disabled={isBlocked}>
                <SelectTrigger className={`bg-gray-950/50 border-gray-700 text-white transition-all duration-200 h-10 sm:h-auto ${
                  isBlocked ? 'cursor-not-allowed' : 'hover:border-red-500/50 focus:border-red-500/50'
                }`}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] bg-gray-900 border-gray-700">
                  {generateWeightOptions().map((weightOption) => {
                    const isPrevious = previousWeight === weightOption.toString();
                    return (
                      <SelectItem 
                        key={weightOption} 
                        value={weightOption.toString()} 
                        className={`text-white hover:bg-red-500/20 focus:bg-red-500/20 ${
                          isPrevious ? 'bg-red-500/10 border-l-2 border-red-500 font-medium' : ''
                        }`}
                      >
                        {weightOption} lbs {isPrevious ? '← Previous' : ''}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* RPE Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
                RPE (Optional)
              </label>
              <Select value={rpe} onValueChange={setRpe} disabled={isBlocked}>
                <SelectTrigger className={`bg-gray-950/50 border-gray-700 text-white transition-all duration-200 h-10 sm:h-auto ${
                  isBlocked ? 'cursor-not-allowed' : 'hover:border-red-500/50 focus:border-red-500/50'
                }`}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {generateRPEOptions().map((rpeOption) => {
                    const isPrevious = previousRpe === rpeOption.toString();
                    return (
                      <SelectItem 
                        key={rpeOption} 
                        value={rpeOption.toString()} 
                        className={`text-white hover:bg-red-500/20 focus:bg-red-500/20 ${
                          isPrevious ? 'bg-red-500/10 border-l-2 border-red-500 font-medium' : ''
                        }`}
                      >
                        RPE {rpeOption} {isPrevious ? '← Previous' : ''}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleLogSet}
            disabled={isLogging || !reps || !weight || isBlocked}
            className={`w-full font-medium py-2.5 sm:py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
              isBlocked 
                ? 'bg-gray-600 border-gray-500 text-gray-300' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isLogging ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2 sm:mr-3"></div>
                <span className="hidden sm:inline">Logging Set...</span>
                <span className="sm:hidden">Logging...</span>
              </>
            ) : isBlocked ? (
              <>
                <span className="hidden sm:inline">🔒 Complete Previous Sets First</span>
                <span className="sm:hidden">🔒 Complete Previous</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Log This Set</span>
                <span className="sm:hidden">Log Set</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
