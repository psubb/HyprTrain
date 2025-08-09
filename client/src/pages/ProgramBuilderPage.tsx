import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type MuscleGroup = {
  id: string;
  name: string;
};

type Exercise = {
  id: string;
  name: string;
  muscle_group_id: string;
  muscle_group_name: string;
  is_default: boolean;
};

type WorkoutDay = {
  dayOfWeek: number;
  exercises: { exerciseId: string; orderIndex: number }[];
};

// Sortable Exercise Item Component
function SortableExerciseItem({ 
  exercise, 
  exerciseData, 
  onRemove 
}: { 
  exercise: { exerciseId: string; orderIndex: number };
  exerciseData: Exercise | undefined;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.exerciseId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/30 group hover:border-gray-600/50 transition-all duration-200 ${
        isDragging ? 'shadow-lg shadow-red-500/25 border-red-500/50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="3" cy="3" r="1"/>
            <circle cx="9" cy="3" r="1"/>
            <circle cx="3" cy="6" r="1"/>
            <circle cx="9" cy="6" r="1"/>
            <circle cx="3" cy="9" r="1"/>
            <circle cx="9" cy="9" r="1"/>
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-white leading-tight" title={exerciseData?.name || "Unknown"}>
            {exerciseData?.name || "Unknown"}
          </div>
          <div className="text-xs text-gray-400 leading-tight" title={exerciseData?.muscle_group_name || ""}>
            {exerciseData?.muscle_group_name || ""}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-400 p-1 h-auto opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 flex-shrink-0"
        >
          <span className="text-sm">×</span>
        </Button>
      </div>
    </div>
  );
}


export default function ProgramBuilderPage() {
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<'setup' | 'calendar'>('setup');
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Program setup data
  const [programName, setProgramName] = useState("");
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  
  // Calendar/workout data
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());
  const [workoutDays, setWorkoutDays] = useState<Map<number, WorkoutDay>>(new Map());
  
  // Exercise selection
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showMuscleGroupDialog, setShowMuscleGroupDialog] = useState(false);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [selectedDayForExercises, setSelectedDayForExercises] = useState<number | null>(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);

  // Load muscle groups and exercises on mount
  useEffect(() => {
    loadMuscleGroupsAndExercises();
  }, []);

  // Filter exercises when muscle group changes
  useEffect(() => {
    console.log('🔄 Filtering exercises. Selected muscle group:', selectedMuscleGroup);
    console.log('📝 Total exercises available:', exercises.length);
    if (selectedMuscleGroup && selectedMuscleGroup !== "all" && selectedMuscleGroup !== "") {
      const filtered = exercises.filter(ex => ex.muscle_group_id === selectedMuscleGroup);
      console.log('🎯 Filtered exercises:', filtered.length);
      setFilteredExercises(filtered);
    } else if (selectedMuscleGroup === "all") {
      console.log('📋 Showing all exercises');
      setFilteredExercises(exercises);
    } else {
      console.log('🚫 No muscle group selected, showing empty list');
      setFilteredExercises([]);
    }
  }, [selectedMuscleGroup, exercises]);

  const loadMuscleGroupsAndExercises = async () => {
    setLoadingExercises(true);
    try {
      console.log('🔍 Loading muscle groups and exercises...');
      console.log('🚀 NEW DEBUG CODE IS RUNNING!');
      console.log('🔑 Token exists:', !!localStorage.getItem('token'));
      console.log('👤 User exists:', !!localStorage.getItem('user'));
      
      const [muscleGroupsRes, exercisesRes] = await Promise.all([
        api.get<MuscleGroup[]>("/muscle-groups"),
        api.get<Exercise[]>("/exercises/all")
      ]);
      console.log('💪 Muscle groups loaded:', muscleGroupsRes.data);
      console.log('🏋️ Exercises loaded:', exercisesRes.data);
      console.log('📊 Exercise count:', exercisesRes.data?.length || 0);
      setMuscleGroups(muscleGroupsRes.data);
      setExercises(exercisesRes.data);
    } catch (e: any) {
      console.error('❌ Error loading exercises and muscle groups:', e);
      console.error('📋 Error details:', e.response?.status, e.response?.data);
      console.error('📋 Error response:', e?.response?.data);
      console.error('🔢 Error status:', e?.response?.status);
      showToast.error("Failed to load exercises and muscle groups");
    } finally {
      setLoadingExercises(false);
    }
  };

  const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayShortLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleSetupSubmit = () => {
    if (!programName.trim()) {
      showToast.error("Please enter a program name");
      return;
    }
    if (durationWeeks < 4 || durationWeeks > 16) {
      showToast.error("Duration must be between 4 and 16 weeks");
      return;
    }
    setCurrentStep('calendar');
  };

  const toggleDay = (dayIndex: number) => {
    const newSelectedDays = new Set(selectedDays);
    if (newSelectedDays.has(dayIndex)) {
      newSelectedDays.delete(dayIndex);
      const newWorkoutDays = new Map(workoutDays);
      newWorkoutDays.delete(dayIndex);
      setWorkoutDays(newWorkoutDays);
    } else {
      newSelectedDays.add(dayIndex);
      const newWorkoutDays = new Map(workoutDays);
      newWorkoutDays.set(dayIndex, { dayOfWeek: dayIndex, exercises: [] });
      setWorkoutDays(newWorkoutDays);
    }
    setSelectedDays(newSelectedDays);
  };

  const openMuscleGroupDialog = (dayIndex: number) => {
    setSelectedDayForExercises(dayIndex);
    setSelectedMuscleGroup("");
    setShowMuscleGroupDialog(true);
  };

  const selectMuscleGroupAndOpenExercises = (muscleGroupId: string) => {
    setSelectedMuscleGroup(muscleGroupId);
    setShowMuscleGroupDialog(false);
    setShowExerciseDialog(true);
  };

  const handleDragEnd = (event: DragEndEvent, dayIndex: number) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const currentWorkoutDay = workoutDays.get(dayIndex);
      if (!currentWorkoutDay) return;

      const oldIndex = currentWorkoutDay.exercises.findIndex(ex => ex.exerciseId === active.id);
      const newIndex = currentWorkoutDay.exercises.findIndex(ex => ex.exerciseId === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedExercises = arrayMove(currentWorkoutDay.exercises, oldIndex, newIndex)
          .map((ex, index) => ({ ...ex, orderIndex: index }));

        const newWorkoutDays = new Map(workoutDays);
        newWorkoutDays.set(dayIndex, {
          ...currentWorkoutDay,
          exercises: reorderedExercises
        });
        setWorkoutDays(newWorkoutDays);
      }
    }
  };

  const addExerciseToDay = (exerciseId: string) => {
    if (selectedDayForExercises === null) return;
    
    const currentWorkoutDay = workoutDays.get(selectedDayForExercises);
    if (!currentWorkoutDay) return;

    // Check if exercise is already added
    if (currentWorkoutDay.exercises.some(ex => ex.exerciseId === exerciseId)) {
      showToast.error("Exercise already added to this day");
      return;
    }

    const newExercises = [
      ...currentWorkoutDay.exercises,
      { exerciseId, orderIndex: currentWorkoutDay.exercises.length }
    ];

    const newWorkoutDays = new Map(workoutDays);
    newWorkoutDays.set(selectedDayForExercises, {
      ...currentWorkoutDay,
      exercises: newExercises
    });
    setWorkoutDays(newWorkoutDays);
    
    const exerciseName = exercises.find(ex => ex.id === exerciseId)?.name || "Exercise";
    showToast.success(`${exerciseName} added to ${dayLabels[selectedDayForExercises]}`);
  };

  const removeExerciseFromDay = (dayIndex: number, exerciseId: string) => {
    const currentWorkoutDay = workoutDays.get(dayIndex);
    if (!currentWorkoutDay) return;

    const newExercises = currentWorkoutDay.exercises
      .filter(ex => ex.exerciseId !== exerciseId)
      .map((ex, index) => ({ ...ex, orderIndex: index }));

    const newWorkoutDays = new Map(workoutDays);
    newWorkoutDays.set(dayIndex, {
      ...currentWorkoutDay,
      exercises: newExercises
    });
    setWorkoutDays(newWorkoutDays);
  };

  const createProgram = async () => {
    // Filter to only include days that have exercises
    const daysWithExercises = Array.from(selectedDays).filter(dayIndex => {
      const workoutDay = workoutDays.get(dayIndex);
      return workoutDay && workoutDay.exercises.length > 0;
    });

    if (daysWithExercises.length === 0) {
      showToast.error("Please add exercises to at least one workout day");
      return;
    }

    setLoading(true);
    try {
      // 1. Create the program
      const programRes = await api.post("/programs", {
        name: programName.trim(),
        duration_weeks: durationWeeks
      });
      
      const programId = programRes.data.program.id;

      // 2. Create workout days only for days with exercises
      await api.post(`/programs/${programId}/workout-days`, {
        daysOfWeek: daysWithExercises,
        durationWeeks
      });

      // 3. Add exercises to each workout day (for week 1 only, then propagate)
      for (const dayIndex of daysWithExercises) {
        const workoutDay = workoutDays.get(dayIndex);
        if (workoutDay && workoutDay.exercises.length > 0) {
          // Find the workout day ID for week 1 of this day
          const weekOverview = await api.get(`/programs/${programId}/weeks/1`);
          const dayData = weekOverview.data.days.find((d: any) => d.day_of_week === dayIndex);
          
          if (dayData) {
            await api.post(`/workout-days/${dayData.id}/exercises`, {
              dayOfWeek: dayIndex,
              exercises: workoutDay.exercises
            });
          }
        }
      }

      const dayCount = daysWithExercises.length;
      showToast.success(`Program created successfully with ${dayCount} workout day${dayCount !== 1 ? 's' : ''}! 🎉`);
      navigate("/programs");
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || "Failed to create program";
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-gray-950 to-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
        
        <div className="relative max-w-2xl mx-auto p-4 sm:p-8 space-y-8 sm:space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12 px-2">
            <div className="inline-flex items-center px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs sm:text-sm font-medium backdrop-blur-sm mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              STEP 1 OF 2
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
              Create New <span className="font-semibold text-red-400 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Program</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Let's start by setting up your program basics. Choose a name that motivates you and select your desired duration.
            </p>
          </div>

          {/* Setup Form */}
          <Card className="border border-gray-800/50 bg-gray-900/40 backdrop-blur-xl shadow-2xl mx-2 sm:mx-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent"></div>
            <CardHeader className="border-b border-gray-800/50 pb-4 relative">
              <CardTitle className="text-lg sm:text-xl font-medium text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-red-400 text-sm font-bold">📋</span>
                </div>
                Program Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6 relative">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Program Name
                </label>
                <Input
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="e.g., Push Pull Legs, Upper Lower, Strength Builder..."
                  className="bg-gray-950/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 h-12 text-base transition-all duration-200 hover:border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Choose a name that will keep you motivated throughout your journey</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Duration (weeks)
                </label>
                <Select 
                  value={durationWeeks.toString()} 
                  onValueChange={(value) => setDurationWeeks(Number(value))}
                >
                  <SelectTrigger className="bg-gray-950/50 border-gray-700 text-white hover:border-red-500/50 focus:border-red-500/50 h-12 transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {Array.from({ length: 13 }, (_, i) => i + 4).map((weeks) => (
                      <SelectItem 
                        key={weeks} 
                        value={weeks.toString()} 
                        className="text-white hover:bg-red-500/20 focus:bg-red-500/20"
                      >
                        {weeks} weeks
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Recommended: 8-12 weeks for optimal progression</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate("/programs")}
                  className="flex-1 bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 hover:text-white border-gray-700 hover:border-gray-600 h-12 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSetupSubmit}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-12 font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                >
                  Next: Setup Workout Days →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calendar/Workout Days Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-gray-950 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-red-500/30 to-transparent"></div>
      
      <div className="relative max-w-5xl mx-auto p-4 sm:p-8 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12 px-2">
          <div className="inline-flex items-center px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs sm:text-sm font-medium backdrop-blur-sm mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            STEP 2 OF 2
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
            <span className="font-semibold text-red-400 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">{programName}</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Build your workout schedule by adding the days you want to train, then add exercises for each day organized by muscle group.
          </p>
        </div>

        {/* Day Selection */}
        <Card className="border border-gray-800/50 bg-gray-900/40 backdrop-blur-xl shadow-2xl mx-2 sm:mx-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent"></div>
          <CardHeader className="border-b border-gray-800/50 pb-4 relative">
            <CardTitle className="text-lg sm:text-xl font-medium text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                <span className="text-red-400 text-sm font-bold">📅</span>
              </div>
              Weekly Schedule
              {selectedDays.size > 0 && (
                <span className="ml-auto text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                  {selectedDays.size} day{selectedDays.size !== 1 ? 's' : ''} selected
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 relative">
            {/* Selected Days Display */}
            {selectedDays.size > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {Array.from(selectedDays).sort().map((dayIndex) => {
                  const workoutDay = workoutDays.get(dayIndex);
                  const exerciseCount = workoutDay?.exercises.length || 0;
                  
                  return (
                    <div key={dayIndex} className="space-y-3">
                      <div className={`rounded-lg p-4 relative overflow-hidden transition-all duration-200 ${
                        exerciseCount > 0 
                          ? "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-500 shadow-lg shadow-red-500/25" 
                          : "bg-gray-800/40 text-gray-300 border border-gray-700/50 shadow-sm"
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold block">
                              {dayShortLabels[dayIndex]}
                            </span>
                            <span className="text-sm opacity-90">
                              {dayLabels[dayIndex]}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {exerciseCount > 0 ? (
                                <>
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                  <span className="text-xs opacity-80">Ready</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                  <span className="text-xs opacity-60">No exercises</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDay(dayIndex)}
                            className={`p-2 h-auto transition-colors ${
                              exerciseCount > 0 
                                ? "text-white/70 hover:text-white hover:bg-white/10" 
                                : "text-gray-500 hover:text-gray-300 hover:bg-gray-700/50"
                            }`}
                          >
                            <span className="text-lg">×</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openMuscleGroupDialog(dayIndex)}
                          className="w-full text-xs bg-gray-800/30 hover:bg-red-500/20 text-gray-300 hover:text-white border-gray-700 hover:border-red-500/50 transition-all duration-200 h-8"
                        >
                          <span className="mr-1">+</span> Add Exercise
                        </Button>
                        
                        {exerciseCount > 0 && (
                          <div className="text-xs text-gray-400 text-center bg-gray-800/20 rounded px-2 py-1 flex items-center justify-center gap-1">
                            <span>{exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''} added</span>
                            {exerciseCount > 1 && (
                              <span className="text-xs text-gray-500">• Drag to reorder</span>
                            )}
                          </div>
                        )}
                        
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) => handleDragEnd(event, dayIndex)}
                        >
                          <SortableContext
                            items={workoutDay?.exercises.map(ex => ex.exerciseId) || []}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {workoutDay?.exercises.map((ex) => {
                                const exercise = exercises.find(e => e.id === ex.exerciseId);
                                return (
                                  <SortableExerciseItem
                                    key={ex.exerciseId}
                                    exercise={ex}
                                    exerciseData={exercise}
                                    onRemove={() => removeExerciseFromDay(dayIndex, ex.exerciseId)}
                                  />
                                );
                              })}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Day Section */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium text-white mb-2">Add Workout Days</h3>
                <p className="text-sm text-gray-400 mb-4">Select which days of the week you want to work out</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-3">
                {dayLabels.map((day, index) => {
                  const isSelected = selectedDays.has(index);
                  
                  if (isSelected) return null; // Don't show already selected days
                  
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => toggleDay(index)}
                      className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 bg-gray-800/30 hover:bg-red-500/20 text-gray-300 hover:text-white border-gray-700 hover:border-red-500/50 transition-all duration-200"
                    >
                      <span className="text-sm font-bold">
                        {dayShortLabels[index]}
                      </span>
                      <span className="text-xs opacity-80 hidden sm:block">
                        {day}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {selectedDays.size === 0 && (
              <div className="text-center py-8 text-gray-500 mt-8">
                <div className="w-16 h-16 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <p className="text-sm mb-2">Select the days above to start building your workout schedule</p>
                <p className="text-xs text-gray-600">Only days with exercises will be included in your program</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 px-2 sm:px-0">
          <Button
            variant="outline"
            onClick={() => setCurrentStep('setup')}
            className="flex-1 bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 hover:text-white border-gray-700 hover:border-gray-600 h-12 transition-all duration-200"
          >
            ← Back to Setup
          </Button>
          <Button
            onClick={createProgram}
            disabled={loading || Array.from(selectedDays).filter(dayIndex => {
              const workoutDay = workoutDays.get(dayIndex);
              return workoutDay && workoutDay.exercises.length > 0;
            }).length === 0}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed h-12 font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Program...
              </>
            ) : (
              <>
                Create Program 🎉
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Muscle Group Selection Dialog */}
      <Dialog open={showMuscleGroupDialog} onOpenChange={setShowMuscleGroupDialog}>
        <DialogContent className="mx-2 sm:mx-4 max-w-2xl w-[calc(100vw-1rem)] sm:w-full">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                <span className="text-red-400 text-lg">🎯</span>
              </div>
              Choose Muscle Group for {selectedDayForExercises !== null ? dayLabels[selectedDayForExercises] : ""}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 mt-2">
              Select which muscle group you want to add exercises for. This will show you all available exercises for that muscle group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {loadingExercises ? (
              <div className="text-center py-12 text-gray-400">
                <div className="w-12 h-12 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-xl">💪</span>
                </div>
                Loading muscle groups...
              </div>
            ) : (
              <div className="grid gap-3">
                {/* All muscle groups option */}
                <Button
                  variant="outline"
                  onClick={() => selectMuscleGroupAndOpenExercises("all")}
                  className="justify-start h-auto p-4 bg-gray-800/30 hover:bg-red-500/10 text-gray-300 hover:text-white border-gray-700 hover:border-red-500/50 transition-all duration-200"
                >
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-sm">All Muscle Groups</div>
                        <div className="text-xs text-gray-400">{exercises.length} exercises available</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-red-400 text-lg ml-2">→</div>
                </Button>

                {/* Individual muscle groups */}
                {muscleGroups.map((mg) => {
                  const count = exercises.filter(ex => ex.muscle_group_id === mg.id).length;
                  return (
                    <Button
                      key={mg.id}
                      variant="outline"
                      onClick={() => selectMuscleGroupAndOpenExercises(mg.id)}
                      className="justify-start h-auto p-4 bg-gray-800/30 hover:bg-red-500/10 text-gray-300 hover:text-white border-gray-700 hover:border-red-500/50 transition-all duration-200"
                    >
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div>
                            <div className="font-medium text-sm">{mg.name}</div>
                            <div className="text-xs text-gray-400">{count} exercise{count !== 1 ? 's' : ''} available</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-red-400 text-lg ml-2">→</div>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-gray-800/50 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowMuscleGroupDialog(false)}
              className="w-full sm:w-auto bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 hover:text-white border-gray-700 hover:border-gray-600 h-10"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exercise Selection Dialog */}
      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
        <DialogContent className="mx-2 sm:mx-4 max-w-3xl w-[calc(100vw-1rem)] sm:w-full max-h-[85vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                <span className="text-red-400 text-lg">💪</span>
              </div>
              {selectedMuscleGroup === "all" ? "All Exercises" : muscleGroups.find(mg => mg.id === selectedMuscleGroup)?.name} - {selectedDayForExercises !== null ? dayLabels[selectedDayForExercises] : ""}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 mt-2">
              Select exercises to add to this workout day.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">

            {/* Exercise List */}
            {loadingExercises ? (
              <div className="text-center py-12 text-gray-400">
                <div className="w-12 h-12 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-xl">💪</span>
                </div>
                Loading exercises...
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-12 h-12 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🔍</span>
                </div>
                <p className="text-sm">No exercises found for this muscle group</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} available
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowExerciseDialog(false);
                      setShowMuscleGroupDialog(true);
                    }}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    ← Change muscle group
                  </Button>
                </div>
                <div className="grid gap-3 max-h-80 overflow-y-auto pr-2">
                  {filteredExercises.map((exercise) => {
                    const isAlreadyAdded = selectedDayForExercises !== null && 
                      workoutDays.get(selectedDayForExercises)?.exercises.some(ex => ex.exerciseId === exercise.id);
                    
                    return (
                      <Button
                        key={exercise.id}
                        variant="outline"
                        onClick={() => addExerciseToDay(exercise.id)}
                        disabled={isAlreadyAdded}
                        className={`justify-start h-auto p-4 transition-all duration-200 ${
                          isAlreadyAdded 
                            ? "bg-gray-800/20 border-gray-700/50 text-gray-500 cursor-not-allowed" 
                            : "bg-gray-800/30 hover:bg-red-500/10 text-gray-300 hover:text-white border-gray-700 hover:border-red-500/50 hover:shadow-md"
                        }`}
                      >
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              isAlreadyAdded ? "bg-gray-600" : "bg-red-500"
                            }`}></div>
                            <div>
                              <div className="font-medium text-sm">{exercise.name}</div>
                              <div className="text-xs text-gray-400">{exercise.muscle_group_name}</div>
                            </div>
                          </div>
                          {isAlreadyAdded && (
                            <div className="text-xs text-gray-500 mt-1 ml-6">Already added to this day</div>
                          )}
                        </div>
                        {!isAlreadyAdded && (
                          <div className="text-red-400 text-lg ml-2">+</div>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-gray-800/50 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowExerciseDialog(false)}
              className="w-full sm:w-auto bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 hover:text-white border-gray-700 hover:border-gray-600 h-10"
            >
              Done Adding Exercises
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
  