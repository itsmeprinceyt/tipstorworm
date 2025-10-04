"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  const { user } = session;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src={user.image || "/default-avatar.png"}
            fill
            alt={user.name || "User"}
            className="rounded-full"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
        {user.username && <p className="text-gray-600 mb-1">@{user.username}</p>}
        <p className="text-gray-700 mb-1">{user.email}</p>
        
        {/* Terminal-like JSON display */}
        <div className="mt-4 text-left">
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-400 text-xs">user-data.json</span>
            </div>
            <pre className="overflow-x-auto">
              <code>{JSON.stringify(user, null, 2)}</code>
            </pre>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}