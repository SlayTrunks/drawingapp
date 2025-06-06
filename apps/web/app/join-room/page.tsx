"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Utility to get token from localStorage
function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export default function JoinRoomPage() {
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!getToken()) {
      router.push("/signin");
    }
  }, [router]);

  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!roomId.trim()) {
      setMessage("Please enter a room ID.");
      return;
    }
    // Optionally, you can validate roomId format here
    router.push(`/chat/${roomId}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Join Room</h2>
      <form onSubmit={handleJoinRoom} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Room ID</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Join Room
        </button>
        {message && (
          <div className="mt-4 p-3 rounded-lg text-center bg-red-100 text-red-700">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

