import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/http";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Program = {
  id: string;
  name: string;
  duration_weeks: number;
  created_at: string;
};

type SetLog = {
  reps: number;
  weight: number | null;
  rpe?: number | null;
  completed?: boolean;
};

type WeekSet = {
  id: string;
  set_number: number;
  log?: SetLog | null;
};

type WeekExercise = {
  id: string;
  exercise_id: string;
  name: string;
  muscle_group_name: string;
  order_index: number;
  note?: string | null;
  sets: WeekSet[];
};

type WeekDay = {
  id: string;
  day_of_week: number; // 0..6 (0=Monday, 6=Sunday)
  is_completed: boolean;
  daily_note?: string | null;
  exercises: WeekExercise[];
};

type WeekPayload = {
  week_number: number;
  days: WeekDay[];
};

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [meta, setMeta] = useState<Program | null>(null);
  const [week, setWeek] = useState<number>(1);
  const [data, setData] = useState<WeekPayload | null>(null);

  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingWeek, setLoadingWeek] = useState(true);
  const [error, setError] = useState("");

  // 1) Load all programs, pick the one that matches :id
  useEffect(() => {
    if (!id) return;
    setLoadingMeta(true);
    (async () => {
      try {
        const { data } = await api.get<Program[]>("/programs");
        const found = data.find((p) => p.id === id) ?? null;
        setMeta(found);
        setWeek(1); // could set to "current week" if your API exposes it later
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load program");
      } finally {
        setLoadingMeta(false);
      }
    })();
  }, [id]);

  // 2) Load selected week contents
  useEffect(() => {
    if (!id || !week) return;
    setLoadingWeek(true);
    setError("");
    setData(null);
    (async () => {
      try {
        const { data } = await api.get<WeekPayload>(`/programs/${id}/weeks/${week}`);
        console.log('Week data:', data); // Debug: Check if muscle_group_name is present
        setData(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load week");
      } finally {
        setLoadingWeek(false);
      }
    })();
  }, [id, week]);

  const weekOptions = useMemo(() => {
    const n = meta?.duration_weeks ?? 0;
    return Array.from({ length: n }, (_, i) => i + 1);
  }, [meta?.duration_weeks]);

  const dayLabel = (n: number) => {
    const map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const idx = Math.max(0, Math.min(6, n));
    return map[idx];
  };

  if (!id) return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black flex items-center justify-center p-4">
      <div className="text-red-400 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm text-sm sm:text-base text-center max-w-sm">
        No program id in URL.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-8 space-y-6 sm:space-y-8 md:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12 px-2">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
              {loadingMeta ? (
                "Loading..."
              ) : (
                <>
                  <span className="font-medium text-red-400 break-words">{meta?.name ?? "Program"}</span>
                </>
              )}
            </h1>
            {!loadingMeta && meta && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-400 text-sm">
                <span>{meta.duration_weeks} weeks</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></div>
                <span>Created {new Date(meta.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Week Selector */}
          <div className="max-w-xs mx-auto px-4 sm:px-0">
            <Select 
              value={week.toString()} 
              onValueChange={(value) => setWeek(Number(value))}
              disabled={loadingMeta || !meta || !weekOptions.length}
            >
              <SelectTrigger className="bg-gray-950/50 border-gray-700 text-white hover:border-red-500/50 focus:border-red-500/50 h-10 sm:h-auto">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {weekOptions.map((w) => (
                  <SelectItem 
                    key={w} 
                    value={w.toString()} 
                    className="text-white hover:bg-red-500/20 focus:bg-red-500/20"
                  >
                    Week {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-red-400 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm text-center mx-2 sm:mx-0 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loadingWeek && (
          <div className="flex justify-center items-center py-8 sm:py-12 text-gray-400 text-sm sm:text-base">
            Loading week...
          </div>
        )}

        {/* Empty State */}
        {!loadingWeek && !error && !data && (
          <div className="text-center py-8 sm:py-12 text-gray-400 text-sm sm:text-base px-4">
            No data available for this week.
          </div>
        )}

        {/* Week Content */}
        {!loadingWeek && !error && data && (
          <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
            <div className="text-center space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-white">
                Week <span className="font-medium text-red-400">{data.week_number}</span>
              </h2>
              <div className="w-12 h-px bg-red-500/30 mx-auto"></div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {data.days.map((day) => (
                <Card key={day.id} className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-gray-800/50 pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-base sm:text-lg font-semibold flex-shrink-0">
                          {dayLabel(day.day_of_week).charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg sm:text-xl font-medium text-white">
                            {dayLabel(day.day_of_week)}
                          </CardTitle>
                          {day.daily_note && (
                            <p className="text-xs sm:text-sm text-gray-400 mt-1 break-words">
                              {day.daily_note}
                            </p>
                          )}
                        </div>
                      </div>
                      {day.is_completed && (
                        <div className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-red-500/20 border border-red-500/30 text-red-400 flex-shrink-0">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5 sm:mr-2"></div>
                          Completed
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      {day.exercises.map((exercise) => (
                        <div key={exercise.id} className="bg-gray-800/20 rounded-xl p-3 sm:p-5 border border-gray-700/30">
                          <div className="mb-3 sm:mb-4">
                            <h4 className="text-base sm:text-lg font-medium text-white leading-tight">{exercise.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">
                              {exercise.muscle_group_name || 'Unknown muscle group'}
                            </p>
                            {exercise.note && (
                              <p className="text-xs sm:text-sm text-gray-400 mt-2 bg-gray-800/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-700/50 break-words">
                                {exercise.note}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2 sm:space-y-3">
                            {exercise.sets.map((set) => (
                              <div key={set.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-950/30 rounded-lg border border-gray-700/20 gap-2 sm:gap-0">
                                <span className="font-medium text-white text-sm sm:text-base">Set {set.set_number}</span>
                                <div className="text-gray-300 text-sm sm:text-base">
                                  {set.log ? (
                                    <div className="flex items-center gap-2">
                                      <span className="break-words">
                                        {set.log.reps} reps
                                        {typeof set.log.weight === "number" ? ` @ ${set.log.weight}lbs` : ""}
                                        {typeof set.log.rpe === "number" ? ` (RPE ${set.log.rpe})` : ""}
                                      </span>
                                      {set.log.completed && (
                                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">No data</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
