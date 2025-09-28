// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="text-xl font-bold">
                <Link href="/">MyApp</Link>
            </div>

            <div className="flex items-center space-x-4">
                <Link href="/" className="hover:text-gray-300">
                    Home
                </Link>
                <Link href="/dashboard" className="hover:text-gray-300">
                    Profile
                </Link>

                {session ? (
                    <>
                        <span className="hidden sm:inline">Hi, {session.user?.name}</span>
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
