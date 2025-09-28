"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    if (session) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
                <p>Signed in as {session.user?.email}</p>
                <button
                    onClick={() => router.push("/profile")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Go to Profile
                </button>
            </div>
        );
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!email || !password) {
            setMessage("Please enter email and password.");
            return;
        }
        
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setMessage(res.error || "Invalid login");
        } else {
            router.push("/profile");
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

            {message && <p className="mb-4 text-red-500">{message}</p>}

            {/* Email & Password Login */}
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Sign in
                </button>
            </form>

            <div className="my-4 border-t border-gray-300"></div>

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
