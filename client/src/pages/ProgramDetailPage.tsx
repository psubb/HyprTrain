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
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black flex items-center justify-center">
      <div className="text-red-400 p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
        No program id in URL.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black">
      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-6 py-8 sm:py-12">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight">
              {loadingMeta ? (
                "Loading..."
              ) : (
                <>
                  <span className="font-medium text-red-400">{meta?.name ?? "Program"}</span>
                </>
              )}
            </h1>
            {!loadingMeta && meta && (
              <div className="flex items-center justify-center gap-3 text-gray-400">
                <span>{meta.duration_weeks} weeks</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span>Created {new Date(meta.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Week Selector */}
          <div className="max-w-xs mx-auto">
            <Select 
              value={week.toString()} 
              onValueChange={(value) => setWeek(Number(value))}
              disabled={loadingMeta || !meta || !weekOptions.length}
            >
              <SelectTrigger className="bg-gray-950/50 border-gray-700 text-white hover:border-red-500/50 focus:border-red-500/50">
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
          <div className="text-red-400 p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loadingWeek && (
          <div className="flex justify-center items-center py-12 text-gray-400">
            Loading week...
          </div>
        )}

        {/* Empty State */}
        {!loadingWeek && !error && !data && (
          <div className="text-center py-12 text-gray-400">
            No data available for this week.
          </div>
        )}

        {/* Week Content */}
        {!loadingWeek && !error && data && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-light text-white">
                Week <span className="font-medium text-red-400">{data.week_number}</span>
              </h2>
              <div className="w-12 h-px bg-red-500/30 mx-auto"></div>
            </div>

            <div className="space-y-6">
              {data.days.map((day) => (
                <Card key={day.id} className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-gray-800/50 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-lg font-semibold">
                          {dayLabel(day.day_of_week).charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-medium text-white">
                            {dayLabel(day.day_of_week)}
                          </CardTitle>
                          {day.daily_note && (
                            <p className="text-sm text-gray-400 mt-1">
                              {day.daily_note}
                            </p>
                          )}
                        </div>
                      </div>
                      {day.is_completed && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/20 border border-red-500/30 text-red-400">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          Completed
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {day.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="bg-gray-800/20 rounded-xl p-5 border border-gray-700/30">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-white">{exercise.name}</h4>
                              {exercise.note && (
                                <p className="text-sm text-gray-400 mt-1 bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-700/50">
                                  {exercise.note}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            {exercise.sets.map((set) => (
                              <div key={set.id} className="flex items-center justify-between p-3 bg-gray-950/30 rounded-lg border border-gray-700/20">
                                <span className="font-medium text-white">Set {set.set_number}</span>
                                <div className="text-gray-300">
                                  {set.log ? (
                                    <div className="flex items-center gap-2">
                                      <span>
                                        {set.log.reps} reps
                                        {typeof set.log.weight === "number" ? ` @ ${set.log.weight}lbs` : ""}
                                        {typeof set.log.rpe === "number" ? ` (RPE ${set.log.rpe})` : ""}
                                      </span>
                                      {set.log.completed && (
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
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
