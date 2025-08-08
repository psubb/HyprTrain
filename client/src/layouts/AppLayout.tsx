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
    { to: "/workout-days/active", label: "Today", icon: "🎯" },
    { to: "/programs", label: "Programs", icon: "📋" },
    { to: "/exercises/custom", label: "My Exercises", icon: "💪" },
    { to: "/programs/new", label: "Program Builder", icon: "🔧" },
  ];

  const NavItems = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <nav className="flex flex-col gap-2">
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onItemClick}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              mobile ? 'text-sm sm:text-base' : 'text-sm'
            } ${
              isActive 
                ? 'bg-red-500/20 border border-red-500/30 text-red-400 shadow-lg backdrop-blur-sm' 
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-gray-700/50'
            }`
          }
        >
          <span className="text-base flex-shrink-0">{item.icon}</span>
          <span className="font-medium break-words">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black text-zinc-100">
      {/* Header */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between border-b border-gray-800/50 sticky top-0 bg-gray-900/30 backdrop-blur-xl z-40 shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200 flex-shrink-0"
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
            <SheetContent side="left" className="w-80 bg-gray-900/95 backdrop-blur-xl border-gray-800/50 shadow-2xl">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center gap-3 mb-8 pt-2">
                  <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-red-400 font-bold text-sm">H</span>
                  </div>
                  <div className="font-bold text-xl text-white">HyprTrain</div>
                </div>
                
                {/* Mobile Navigation */}
                <NavItems mobile onItemClick={() => setMobileMenuOpen(false)} />
                
                {/* Mobile Footer */}
                <div className="mt-auto pt-6">
                  <Separator className="mb-4 bg-gray-800/50" />
                  <div className="text-xs text-gray-500 px-4 flex items-center justify-between">
                    <span>v0.1.0</span>
                    <span className="text-red-400/70">Beta</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-red-400 font-bold text-sm">H</span>
            </div>
            <div className="font-bold text-lg sm:text-xl text-white truncate">HyprTrain</div>
          </div>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {!token ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex text-sm hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
                size="sm"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/register")} 
                size="sm" 
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 transition-colors duration-200 text-sm"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <span className="text-gray-300 px-2 text-sm hidden sm:block truncate max-w-32 bg-gray-800/30 border border-gray-700/50 rounded-lg py-1.5">
                {user?.email}
              </span>
              <Button 
                variant="outline" 
                onClick={logout} 
                size="sm" 
                className="border-gray-700 hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200 text-sm px-3"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 lg:w-72 border-r border-gray-800/50 bg-gray-900/20 backdrop-blur-sm">
          <div className="p-6 h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="mb-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-red-400 font-bold text-lg">H</span>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-lg text-white">HyprTrain</div>
                  <div className="text-xs text-gray-500">Fitness Tracking</div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Navigation</h3>
                <NavItems />
              </div>
            </div>
            
            {/* Sidebar Footer */}
            <div className="mt-auto">
              <Separator className="mb-4 bg-gray-800/50" />
              <div className="bg-gray-800/20 border border-gray-700/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Version 0.1.0</span>
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-medium">Beta</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
