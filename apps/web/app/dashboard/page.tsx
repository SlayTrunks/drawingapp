// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../utils/auth";

type Room = {
  id: string;
  slug: string;
  name: string;
};

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:3000/user/rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, [router]);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Your Rooms</h2>
      <div className="space-y-4">
        {rooms.length === 0 && (
          <p className="text-gray-600 text-center">No rooms found. Create one!</p>
        )}
        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => router.push(`/chat/${room.id}`)}
          >
            <h3 className="font-semibold text-lg">{room.name}</h3>
            <p className="text-gray-600 text-sm">ID: {room.id}</p>
            <p className="text-gray-500 text-sm">Slug: {room.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

