"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function SetPassword() {
  const { data: session } = useSession();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  if (!session?.user?.email) {
    return <p>You must be logged in to set a password.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirm) return setMessage("Please fill all fields");
    if (password !== confirm) return setMessage("Passwords do not match");

    try {
      const res = await axios.post("/api/dashboard/set-password", {
        email: session.user.email,
        password,
      });

      if (res.data.success) {
        setMessage("Password set successfully! You can now login with email/password.");
        setPassword("");
        setConfirm("");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Set Your Password</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Set Password
        </button>
      </form>
    </div>
  );
}
