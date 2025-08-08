import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AppLayout() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  function logout(){
    setToken(null);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="h-14 px-4 flex items-center justify-between border-b border-zinc-800">
        <div className="font-semibold">HyprTrain</div>
        <div className="flex items-center gap-2">
          {!token ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>Sign Up</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/programs/new")}>
                New Program
              </Button>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </>
          )}
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-64 border-r border-zinc-800 p-3">
          <nav className="flex flex-col gap-1 text-zinc-300">
            <NavLink to="/workout-days/active" className="rounded px-3 py-2 hover:bg-zinc-900">
              Today
            </NavLink>
            <NavLink to="/programs" className="rounded px-3 py-2 hover:bg-zinc-900">
              Programs
            </NavLink>
            <NavLink to="/exercises/custom" className="rounded px-3 py-2 hover:bg-zinc-900">
              My Exercises
            </NavLink>
            <NavLink to="/programs/new" className="rounded px-3 py-2 hover:bg-zinc-900">
              Program Builder
            </NavLink>
          </nav>
          <Separator className="my-3" />
          <div className="text-xs text-zinc-500 px-3">v0</div>
        </aside>

        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
