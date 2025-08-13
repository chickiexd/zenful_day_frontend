"use client";

import { authClient } from "@/lib/auth/auth-client";
import { apiClient } from "@/services/api/client";

import { useState } from "react";

export default function TestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const testGoAPI = async () => {
    const response = await apiClient.get("youtube/channel_groups");
    console.log("API Response:", response);
  };

  const testSignUp = async () => {
    try {
      const result = await authClient.signUp.email({
        email: "no@email.com",
        password,
        name: "Test User",
        username: email,
      });
      setAuthMessage(`Sign Up Success: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      const err = error as { message?: string };
      setAuthMessage(`Sign Up Error: ${err?.message ?? 'Unknown error'}`);
    }
  };

  const testSignIn = async () => {
    try {
      const result = await authClient.signIn.username({
        username: email,
        password,
      });
      setAuthMessage(`Sign In Success: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      const err = error as { message?: string };
      setAuthMessage(`Sign In Error: ${err?.message ?? 'Unknown error'}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl text-[#cdd6f4] mb-6">API Test Dashboard</h1>

      {/* Better Auth Test Section */}
      <div className="mb-8 p-6 bg-[#313244] border border-[#45475a] rounded-lg">
        <h2 className="text-xl text-[#cdd6f4] mb-4">Better Auth Test</h2>
        <div className="space-y-4 max-w-md">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password (8+ chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <button
              onClick={testSignUp}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex-1"
            >
              Sign Up
            </button>
            <button
              onClick={testSignIn}
              className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded flex-1"
            >
              Sign In
            </button>
          </div>

          {authMessage && (
            <div className="p-4 bg-gray-100 rounded">
              <pre className="text-sm whitespace-pre-wrap">{authMessage}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Go Backend Test Section */}
      <div className="p-6 border rounded-lg">
        <h2 className="text-xl mb-4">Go Backend API Test</h2>
        <button
          onClick={testGoAPI}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded w-full max-w-md"
        >
          Test Go Backend Auth Verify
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>
          <strong>Flow:</strong> Sign Up → Sign In → Test Go Backend
        </p>
        <p>Make sure your Go backend is running on port 8080!</p>
      </div>
    </div>
  );
}
