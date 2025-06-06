"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Utility function to get token from localStorage
function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export default function CreateRoomPage() {
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!getToken()) {
      router.push("/signin");
    }
  }, [router]);

  const handleCreateRoom = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsCreating(true);

    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch("http://localhost:3000/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: roomName }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || data.msg || "Failed to create room");
      }

      // Redirect to chat room if successful
      if (data.roomId) {
        router.push(`/chat/${data.roomId}`);
      } else {
        setMessage(data.msg || "Room created, but no roomId returned.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to create room"
      );
      setIsCreating(false);
    } finally {
      setRoomName("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Create New Room</h1>
      <form onSubmit={handleCreateRoom} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            minLength={3}
            maxLength={50}
          />
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className={`w-full py-2 px-4 rounded-lg text-white transition-colors
            ${isCreating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {isCreating ? "Creating..." : "Create Room"}
        </button>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            message.toLowerCase().includes("success") || message.toLowerCase().includes("created")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

