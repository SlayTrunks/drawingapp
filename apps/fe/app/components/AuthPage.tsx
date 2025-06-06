"use client"

import { useRouter } from "next/navigation"

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    const router = useRouter()
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center text-indigo-700 mb-2">
                    {isSignin ? "Sign In" : "Sign Up"}
                </h2>
                <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    autoComplete="email"
                />
                {
                    !isSignin && <input
                        type="text"
                        placeholder="Name"
                        name="email"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        autoComplete="email"
                    />

                }{
                    !isSignin && <input
                        type="text"
                        placeholder="Photo"
                        name="email"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        autoComplete="email"
                    />

                }
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    autoComplete="current-password"
                />
                <button
                    type="button"
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                >
                    {isSignin ? "Sign In" : "Sign Up"}
                </button>
                <div className="text-center text-gray-500">
                    {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
                    {isSignin ?

                        <button
                            type="button"
                            className="text-indigo-600 cursor-pointer hover:underline font-medium"
                            onClick={() => router.push("/signup")}
                        >Sign Up
                        </button> :
                        <button
                            type="button"
                            className="text-indigo-600 cursor-pointer hover:underline font-medium"
                            onClick={() => router.push("/signin")}
                        >
                            Sign In
                        </button>
                    }

                </div>
            </div>
        </div>

    )
}
