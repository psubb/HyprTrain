import { useState, useEffect } from "react";
import { Plus, Trash2, Dumbbell } from "lucide-react";
import api from "@/api/http";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showToast } from "@/components/ui/toast";

interface Exercise {
  id: string;
  name: string;
  muscle_group_id: string;
  user_id: string | null;
  is_default: boolean;
  is_deleted: boolean;
}

interface MuscleGroup {
  id: string;
  name: string;
}

export default function CustomExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [selectedMuscleGroupId, setSelectedMuscleGroupId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch custom exercises and muscle groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [exercisesResponse, muscleGroupsResponse] = await Promise.all([
          api.get("/exercises/custom"),
          api.get("/muscle-groups")
        ]);
        
        setExercises(exercisesResponse.data);
        setMuscleGroups(muscleGroupsResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get muscle group name by ID
  const getMuscleGroupName = (muscleGroupId: string) => {
    const muscleGroup = muscleGroups.find(mg => mg.id === muscleGroupId);
    return muscleGroup?.name || "Unknown";
  };

  // Handle create exercise
  const handleCreateExercise = async () => {
    if (!newExerciseName.trim() || !selectedMuscleGroupId) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await api.post("/exercises", {
        exerciseName: newExerciseName.trim(),
        muscleGroupId: selectedMuscleGroupId
      });

      setExercises(prev => [...prev, response.data]);
      setIsCreateDialogOpen(false);
      setNewExerciseName("");
      setSelectedMuscleGroupId("");
      showToast.success("Exercise created successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create exercise";
      
      // Close dialog and reset form for all errors
      setIsCreateDialogOpen(false);
      setNewExerciseName("");
      setSelectedMuscleGroupId("");
      setError(null);
      
      // Show appropriate toast message
      if (errorMessage.includes("already exists")) {
        showToast.error("Exercise with this name already exists");
      } else {
        showToast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  const handleCreateDialogChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setNewExerciseName("");
      setSelectedMuscleGroupId("");
      setError(null);
    }
  };

  // Handle delete exercise
  const handleDeleteExercise = async () => {
    if (!exerciseToDelete) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/exercises/${exerciseToDelete.id}`);
      setExercises(prev => prev.filter(ex => ex.id !== exerciseToDelete.id));
      setIsDeleteDialogOpen(false);
      setExerciseToDelete(null);
      showToast.success("Exercise deleted successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete exercise";
      setIsDeleteDialogOpen(false);
      setExerciseToDelete(null);
      
      // Show toast error but don't set global error to keep page usable
      if (errorMessage.includes("currently being used")) {
        showToast.error("Cannot delete exercise that is currently being used in workouts");
      } else {
        showToast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation dialog
  const confirmDelete = (exercise: Exercise) => {
    setExerciseToDelete(exercise);
    setIsDeleteDialogOpen(true);
  };

  // Group exercises by muscle group
  const exercisesByMuscleGroup = exercises.reduce((acc, exercise) => {
    const muscleGroupName = getMuscleGroupName(exercise.muscle_group_id);
    if (!acc[muscleGroupName]) {
      acc[muscleGroupName] = [];
    }
    acc[muscleGroupName].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-8 space-y-6 sm:space-y-8">
          <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight">
              My <span className="font-medium text-red-400">Exercises</span>
            </h1>
          </div>
          <div className="flex justify-center items-center py-8 sm:py-12 text-gray-400 text-sm sm:text-base">
            Loading exercises...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-8 space-y-6 sm:space-y-8">
          <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight">
              My <span className="font-medium text-red-400">Exercises</span>
            </h1>
          </div>
          <div className="text-red-400 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm text-center mx-2 sm:mx-0 text-sm sm:text-base">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-8 space-y-6 sm:space-y-8 md:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12 px-2">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight">
              My <span className="font-medium text-red-400">Exercises</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Create and manage your custom exercises</p>
          </div>
          
          {/* Create Exercise Button */}
          <div className="pt-4 sm:pt-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 mx-4 sm:mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-white text-lg sm:text-xl">Create New Exercise</DialogTitle>
                </DialogHeader>
                {error && (
                  <div className="text-red-400 p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs sm:text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-200 mb-2 block">
                      Exercise Name
                    </label>
                    <Input
                      value={newExerciseName}
                      onChange={(e) => setNewExerciseName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newExerciseName.trim() && selectedMuscleGroupId) {
                          handleCreateExercise();
                        }
                      }}
                      placeholder="Enter exercise name"
                      className="bg-gray-950/50 border-gray-700 text-white focus:border-red-500/50 h-10 sm:h-auto"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200 mb-2 block">
                      Muscle Group
                    </label>
                    <Select value={selectedMuscleGroupId} onValueChange={setSelectedMuscleGroupId}>
                      <SelectTrigger className="bg-gray-950/50 border-gray-700 text-white hover:border-red-500/50 focus:border-red-500/50 h-10 sm:h-auto">
                        <SelectValue placeholder="Select muscle group" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {muscleGroups.map((mg) => (
                          <SelectItem key={mg.id} value={mg.id} className="text-white hover:bg-red-500/20 focus:bg-red-500/20">
                            {mg.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => handleCreateDialogChange(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateExercise}
                    disabled={isSubmitting || !newExerciseName.trim() || !selectedMuscleGroupId}
                    className="bg-red-600 hover:bg-red-700 text-white order-1 sm:order-2"
                  >
                    {isSubmitting ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg sm:text-xl">Delete Exercise</DialogTitle>
            </DialogHeader>
            <p className="text-gray-300 text-sm sm:text-base">
              Are you sure you want to delete "{exerciseToDelete?.name}"? This action cannot be undone.
            </p>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteExercise}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white order-1 sm:order-2"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Exercises List */}
        <div className="px-2 sm:px-0">
          {exercises.length === 0 ? (
            <Card className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl mx-auto">
                    <Dumbbell className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl font-medium text-white">No Custom Exercises</h3>
                    <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
                      You haven't created any custom exercises yet. Create your first one to get started!
                    </p>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Exercise
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {Object.entries(exercisesByMuscleGroup)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([muscleGroupName, groupExercises]) => (
                  <div key={muscleGroupName}>
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                        <span className="font-medium text-red-400">{muscleGroupName}</span>
                        <span className="text-gray-400 text-base sm:text-lg ml-2">({groupExercises.length})</span>
                      </h2>
                      <div className="w-12 h-px bg-red-500/30 mt-2"></div>
                    </div>
                    <div className="grid gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {groupExercises.map((exercise) => (
                        <Card key={exercise.id} className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-200 hover:border-gray-700/50 hover:bg-gray-900/40">
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white text-sm sm:text-base leading-tight break-words mb-1">
                                  {exercise.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-400">{muscleGroupName}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(exercise)}
                                className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-600 flex-shrink-0 h-8 w-8 p-0 sm:h-9 sm:w-9"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
