import api from "@/api/http";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FormEvent } from "react"; 
import { useState } from "react";

export default function LoginPage() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (!data.accessToken || !data.user) {
        throw new Error("Invalid response from server");
      }

      setToken(data.accessToken); // save token in context + localStorage
      setUser(data.user);
      navigate("/workout-days/active");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-gray-950 to-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-red-500/30 to-transparent"></div>
      
      <div className="relative w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center">
              <span className="text-red-400 font-bold text-2xl">H</span>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              Welcome to <span className="font-medium text-red-400">HyprTrain</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Sign in to continue your fitness journey</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="text-center">
              <h2 className="text-xl font-medium text-white">Sign In</h2>
            </div>
            {error && (
              <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <Input 
                    name="email" 
                    placeholder="Enter your email" 
                    type="email" 
                    required 
                    className="h-12 bg-gray-950/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <Input 
                    name="password" 
                    placeholder="Enter your password" 
                    type="password" 
                    required 
                    className="h-12 bg-gray-950/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
              </div>
              
              <Button 
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium text-base transition-colors duration-200" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
            >
              Create one here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
