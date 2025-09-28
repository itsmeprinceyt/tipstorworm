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

        <button
          onClick={() => signOut()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
