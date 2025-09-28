"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

            {/* Google Sign-In */}
            <button
                onClick={() => signIn("google")}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
                Sign in with Google
            </button>
        </div>
    );
}
