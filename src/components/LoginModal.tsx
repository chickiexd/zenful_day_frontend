"use client";
import React, { useState } from "react";
import authClient from "@/lib/auth/auth-client";

export default function LoginModal() {
  const { data: session } = authClient.useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const handleLogout = async () => { try { await authClient.signOut(); } catch (err) { console.error(err); } };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form.password.value;
    try {
      await authClient.signIn.username({ username, password });
      setShowLogin(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (session?.user) {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setShowMenu(prev => !prev)}
          className="px-4 py-2 bg-[#89b4fa] hover:bg-[#74a8fc] text-[#1e1e2e] rounded"
        >
          {session.user.username}
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 bg-[#6c7086] text-[#cdd6f4] rounded shadow-lg">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-[#7f849c]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className="px-4 py-2 bg-[#a6e3a1] hover:bg-[#89d88b] text-[#1e1e2e] rounded"
      >
        Login
      </button>
      {showLogin && (
        <div className="fixed inset-0 bg-[#11111b] bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#313244] p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                name="username"
                type="username"
                placeholder="Username"
                className="mb-3 p-2 border rounded"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="mb-4 p-2 border rounded"
                required
              />
              <button
                type="submit"
className="px-4 py-2 bg-[#a6e3a1] hover:bg-[#89d88b] text-[#1e1e2e] rounded"              >
                Submit
              </button>
            </form>
            <button
              onClick={() => setShowLogin(false)}
              className="mt-2 text-sm text-[#bac2de]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
