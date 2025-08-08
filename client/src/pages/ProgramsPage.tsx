import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/http";

type Program = {
  id: string;
  name: string;
  duration_weeks: number;
  is_active: boolean;
  created_at: string;
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Program[]>("/programs");
        setPrograms(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load programs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading programs…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!programs.length) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">My Programs</h1>
        <p className="text-zinc-400">No programs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">My Programs</h1>
      <div className="grid gap-3">
        {programs.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/programs/${p.id}`)}
            className="text-left bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-800"
          >
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-zinc-400">
              {p.duration_weeks} weeks • {p.is_active ? "Active" : "Inactive"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
