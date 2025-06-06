"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "../../utils/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSignin = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("http://localhost:3000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMsg(data.msg || data.error);
    if (data.token) {
      setToken(data.token);
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Sign In</h2>
      <form onSubmit={handleSignin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
          Sign In
        </button>
      </form>
      {msg && <div className="mt-4 text-center text-red-600">{msg}</div>}
    </div>
  );
}

