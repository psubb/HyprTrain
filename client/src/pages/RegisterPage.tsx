import api from "@/api/http";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FormEvent } from "react"; 
import { useState } from "react";

export default function RegisterPage() {
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
    const confirmPassword = String(form.get("confirmPassword"));

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/register", { email, password });

      if (!data.accessToken || !data.user) {
        throw new Error("Invalid response from server");
      }

      setToken(data.accessToken); // save token in context + localStorage
      setUser(data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
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
              <span className="text-red-400 font-bold text-xl">HT</span>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              Join <span className="font-medium text-red-400">HyprTrain</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Create your account and start your fitness journey</p>
          </div>
        </div>

        {/* Register Form */}
        <Card className="border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="text-center">
              <h2 className="text-xl font-medium text-white">Create Account</h2>
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
                  <PasswordInput 
                    name="password" 
                    placeholder="Create a password" 
                    required 
                    className="h-12 bg-gray-950/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                  <PasswordInput 
                    name="confirmPassword" 
                    placeholder="Confirm your password" 
                    required 
                    className="h-12 bg-gray-950/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
              </div>
              
              <div className="text-xs text-gray-400 bg-gray-800/20 border border-gray-700/30 rounded-lg p-3">
                <p>• Password must be at least 8 characters long</p>
                <p>• Must contain at least one lowercase letter</p>
                <p>• Must contain at least one uppercase letter</p>
                <p>• Must contain at least one number</p>
              </div>
              
              <Button 
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium text-base transition-colors duration-200" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
