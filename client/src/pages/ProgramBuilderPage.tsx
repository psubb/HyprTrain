import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast";

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


export default function ProgramBuilderPage() {
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<'setup' | 'calendar'>('setup');
  
  // Program setup data
  const [programName, setProgramName] = useState("");
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  
  // Calendar/workout data
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());
  const [workoutDays, setWorkoutDays] = useState<Map<number, WorkoutDay>>(new Map());
  
  // Exercise selection
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [selectedDayForExercises, setSelectedDayForExercises] = useState<number | null>(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all");
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
    if (selectedMuscleGroup && selectedMuscleGroup !== "all") {
      const filtered = exercises.filter(ex => ex.muscle_group_id === selectedMuscleGroup);
      console.log('🎯 Filtered exercises:', filtered.length);
      setFilteredExercises(filtered);
    } else {
      console.log('📋 Showing all exercises');
      setFilteredExercises(exercises);
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

  const openExerciseDialog = (dayIndex: number) => {
    setSelectedDayForExercises(dayIndex);
    setSelectedMuscleGroup("all");
    setShowExerciseDialog(true);
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
    if (selectedDays.size === 0) {
      showToast.error("Please select at least one workout day");
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

      // 2. Create workout days
      const daysOfWeek = Array.from(selectedDays);
      await api.post(`/programs/${programId}/workout-days`, {
        daysOfWeek,
        durationWeeks
      });

      // 3. Add exercises to each workout day (for week 1 only, then propagate)
      for (const [dayIndex, workoutDay] of workoutDays) {
        if (workoutDay.exercises.length > 0) {
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

      showToast.success("Program created successfully! 🎉");
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
            Select your workout days and add exercises for each day. Click on any day to make it active, then add exercises by muscle group.
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
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 sm:gap-4">
              {dayLabels.map((day, index) => {
                const isSelected = selectedDays.has(index);
                const workoutDay = workoutDays.get(index);
                const exerciseCount = workoutDay?.exercises.length || 0;
                
                return (
                  <div key={index} className="space-y-3">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => toggleDay(index)}
                      className={`w-full h-24 sm:h-28 flex flex-col items-center justify-center space-y-2 transition-all duration-300 relative group ${
                        isSelected 
                          ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500 shadow-lg shadow-red-500/25" 
                          : "bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 hover:text-white border-gray-700 hover:border-gray-600 hover:shadow-lg"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
                      )}
                      <div className="relative z-10 text-center">
                        <span className="text-sm sm:text-base font-bold block">
                          {dayShortLabels[index]}
                        </span>
                        <span className="text-xs opacity-80 hidden sm:block">
                          {day}
                        </span>
                        {isSelected && exerciseCount > 0 && (
                          <div className="mt-1 w-2 h-2 bg-white rounded-full mx-auto animate-pulse"></div>
                        )}
                      </div>
                    </Button>
                    
                    {isSelected && (
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openExerciseDialog(index)}
                          className="w-full text-xs bg-gray-800/30 hover:bg-red-500/20 text-gray-300 hover:text-white border-gray-700 hover:border-red-500/50 transition-all duration-200 h-8"
                        >
                          <span className="mr-1">+</span> Add Exercise
                        </Button>
                        
                        {exerciseCount > 0 && (
                          <div className="text-xs text-gray-400 text-center bg-gray-800/20 rounded px-2 py-1">
                            {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''} added
                          </div>
                        )}
                        
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
                          {workoutDay?.exercises.map((ex) => {
                            const exercise = exercises.find(e => e.id === ex.exerciseId);
                            return (
                              <div key={ex.exerciseId} className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/30 group hover:border-gray-600/50 transition-all duration-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-white truncate">
                                      {exercise?.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                      {exercise?.muscle_group_name || ""}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeExerciseFromDay(index, ex.exerciseId)}
                                    className="text-gray-400 hover:text-red-400 p-1 h-auto opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10"
                                  >
                                    <span className="text-sm">×</span>
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {selectedDays.size === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <p className="text-sm">Click on the days above to select your workout schedule</p>
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
            disabled={loading || selectedDays.size === 0}
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

      {/* Exercise Selection Dialog */}
      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
        <DialogContent className="mx-2 sm:mx-4 max-w-3xl w-[calc(100vw-1rem)] sm:w-full max-h-[85vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                <span className="text-red-400 text-lg">💪</span>
              </div>
              Add Exercises to {selectedDayForExercises !== null ? dayLabels[selectedDayForExercises] : ""}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 mt-2">
              Select exercises to add to this workout day. You can filter by muscle group to find exercises faster.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
            {/* Muscle Group Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                Filter by Muscle Group
              </label>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger className="bg-gray-950/50 border-gray-700 text-white hover:border-red-500/50 focus:border-red-500/50 h-12 transition-all duration-200">
                  <SelectValue placeholder="All muscle groups" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all" className="text-white hover:bg-red-500/20 focus:bg-red-500/20">
                    All muscle groups ({exercises.length} exercises)
                  </SelectItem>
                  {muscleGroups.map((mg) => {
                    const count = exercises.filter(ex => ex.muscle_group_id === mg.id).length;
                    return (
                      <SelectItem 
                        key={mg.id} 
                        value={mg.id} 
                        className="text-white hover:bg-red-500/20 focus:bg-red-500/20"
                      >
                        {mg.name} ({count} exercises)
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

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
                  {selectedMuscleGroup && selectedMuscleGroup !== "all" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMuscleGroup("all")}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Clear filter
                    </Button>
                  )}
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
  