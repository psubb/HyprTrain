import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AppLayout() {
  const navigate = useNavigate();
  const { token, user, setToken } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function logout(){
    setToken(null);
    navigate("/login");
  }

  const navigationItems = [
    { to: "/workout-days/active", label: "Today" },
    { to: "/programs", label: "Programs" },
    { to: "/exercises/custom", label: "My Exercises" },
    { to: "/programs/new", label: "Program Builder" },
  ];

  const NavItems = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <nav className={`flex ${mobile ? 'flex-col' : 'flex-col'} gap-1 text-zinc-300`}>
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onItemClick}
          className={({ isActive }) =>
            `rounded px-3 py-3 hover:bg-zinc-900 transition-colors ${
              mobile ? 'text-base' : 'text-sm'
            } ${isActive ? 'bg-zinc-800 text-white' : ''}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="h-14 px-4 flex items-center justify-between border-b border-zinc-800 sticky top-0 bg-zinc-950 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                aria-label="Open menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-zinc-950 border-zinc-800">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-6">
                  <div className="font-bold text-xl">HyprTrain</div>
                </div>
                <NavItems mobile onItemClick={() => setMobileMenuOpen(false)} />
                <Separator className="my-6" />
                <div className="text-xs text-zinc-500 px-3">v0</div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="font-semibold text-lg">HyprTrain</div>
        </div>
        <div className="flex items-center gap-2">
          {!token ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex"
              >
                Login
              </Button>
              <Button onClick={() => navigate("/register")} size="sm">
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <span className="text-zinc-300 px-2 text-sm hidden sm:block">
                {user?.email}
              </span>
              <Button variant="outline" onClick={logout} size="sm">
                Logout
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 border-r border-zinc-800 p-3">
          <NavItems />
          <Separator className="my-3" />
          <div className="text-xs text-zinc-500 px-3">v0</div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
