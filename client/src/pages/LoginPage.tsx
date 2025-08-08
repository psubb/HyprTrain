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
    <div className="min-h-screen grid place-items-center bg-zinc-950 text-zinc-100">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-3 bg-zinc-900 p-6 rounded-xl border border-zinc-800"
      >
        <div className="text-lg font-semibold">Log in</div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Input name="email" placeholder="Email" type="email" required />
        <Input name="password" placeholder="Password" type="password" required />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
