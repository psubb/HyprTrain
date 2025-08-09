import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/http";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

  if (loading) return <div className="flex justify-center items-center min-h-32 text-gray-400 text-sm sm:text-base p-4">Loading programs…</div>;
  if (error) return <div className="text-red-400 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm mx-2 sm:mx-0 text-sm sm:text-base">{error}</div>;
  if (!programs.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-gray-950 to-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto p-3 sm:p-4 md:p-8 space-y-6 sm:space-y-8">
          <div className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-white">
              My <span className="font-medium text-red-400">Programs</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">No programs yet. Create your first training program to get started.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-gray-950 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-red-500/30 to-transparent"></div>
      
      <div className="relative max-w-4xl mx-auto p-3 sm:p-4 md:p-8 space-y-6 sm:space-y-8 md:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12 px-2">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight">
              My <span className="font-medium text-red-400">Programs</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your training programs and track your progress</p>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
          {programs.map((program) => (
            <Card 
              key={program.id} 
              className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-gray-700/50 hover:bg-gray-900/40"
              onClick={() => navigate(`/programs/${program.id}`)}
            >
              <CardHeader className="border-b border-gray-800/50 pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-base sm:text-lg font-semibold flex-shrink-0">
                      {program.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-medium text-white leading-tight break-words">
                        {program.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 mt-1 text-gray-400 text-xs sm:text-sm">
                        <span>{program.duration_weeks} weeks</span>
                        <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></div>
                        <span>Created {new Date(program.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
                    program.is_active 
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                      : 'bg-gray-700/30 border border-gray-600/30 text-gray-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-1.5 sm:mr-2 ${
                      program.is_active ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                    {program.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <p className="text-gray-300 text-sm sm:text-base flex-1">
                    {program.is_active 
                      ? "Currently active program - continue your training journey" 
                      : "Click to view program details and workouts"
                    }
                  </p>
                  <div className="text-gray-400 text-xs sm:text-sm flex-shrink-0">
                    View Details →
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
