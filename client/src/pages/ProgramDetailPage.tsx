import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/http";

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
  day_of_week: number; // 1..7
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
    const idx = Math.max(1, Math.min(7, n)) - 1;
    return map[idx];
  };

  if (!id) return <div className="text-red-500">No program id in URL.</div>;

  return (
    <div className="space-y-4">
      {/* Header + Week selector */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            {loadingMeta ? "Loading…" : meta?.name ?? "Program"}
          </h1>
          {!loadingMeta && meta && (
            <p className="text-zinc-400 text-sm">{meta.duration_weeks} weeks</p>
          )}
        </div>

        <select
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
          disabled={loadingMeta || !meta || !weekOptions.length}
        >
          {weekOptions.map((w) => (
            <option key={w} value={w}>
              Week {w}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {loadingWeek && <div>Loading week…</div>}
      {!loadingWeek && !error && !data && (
        <div className="text-zinc-400">No data for this week.</div>
      )}

      {!loadingWeek && !error && data && (
        <div className="space-y-4">
          {data.days.map((day) => (
            <div key={day.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="font-medium mb-2 flex items-center gap-2">
                <span>{dayLabel(day.day_of_week)}</span>
                {day.is_completed && (
                  <span className="text-xs text-zinc-400">(completed)</span>
                )}
              </div>

              {day.daily_note && (
                <div className="text-xs text-zinc-400 mb-2">Note: {day.daily_note}</div>
              )}

              <div className="space-y-3">
                {day.exercises.map((ex) => (
                  <div key={ex.id} className="border border-zinc-800 rounded p-3">
                    <div className="font-medium">{ex.name}</div>
                    {ex.note && (
                      <div className="text-xs text-zinc-400 mt-1">Note: {ex.note}</div>
                    )}

                    <ul className="text-sm text-zinc-300 mt-2 space-y-1">
                      {ex.sets.map((s) => (
                        <li key={s.id}>
                          Set {s.set_number}:{" "}
                          {s.log
                            ? `${s.log.reps} reps${
                                typeof s.log.weight === "number" ? ` @ ${s.log.weight}` : ""
                              }${
                                typeof s.log.rpe === "number" ? ` (RPE ${s.log.rpe})` : ""
                              }${s.log.completed ? " ✓" : ""}`
                            : "—"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
