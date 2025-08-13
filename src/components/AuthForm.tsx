"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode?: AuthMode;
  redirectTo?: string; // serializable
};

export default function AuthForm({ mode = "login", redirectTo = "/" }: AuthFormProps) {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        let message = "Authentication failed";
        try {
          const data: { message?: string } = await res.json();
          if (data?.message) message = data.message;
        } catch {}
        throw new Error(message);
      }

      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>

      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
        required
        autoComplete="username"
        disabled={loading}
      />

      <label htmlFor="password" style={{ marginTop: 12 }}>Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        disabled={loading}
      />

      {error && <p style={{ color: "red" }} role="alert" aria-live="polite">{error}</p>}

      <button type="submit" disabled={loading} style={{ marginTop: 20 }}>
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}

