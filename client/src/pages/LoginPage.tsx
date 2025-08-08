import api from "@/api/http";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen grid place-items-center bg-zinc-950 text-zinc-100 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 bg-zinc-900 p-6 sm:p-8 rounded-xl border border-zinc-800 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <div className="text-xl sm:text-2xl font-bold">HyprTrain</div>
          <div className="text-base sm:text-lg font-semibold text-zinc-300">Log in</div>
        </div>
        {error && <div className="text-red-500 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded">{error}</div>}
        <div className="space-y-4">
          <Input 
            name="email" 
            placeholder="Email" 
            type="email" 
            required 
            className="h-12 text-base"
          />
          <Input 
            name="password" 
            placeholder="Password" 
            type="password" 
            required 
            className="h-12 text-base"
          />
        </div>
        <Button 
          className="w-full h-12 text-base font-semibold" 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
