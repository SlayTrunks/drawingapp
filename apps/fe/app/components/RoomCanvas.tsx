"use client";
import { draw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";
export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZTJmYWIxZC00MzE2LTQ0YTktYTBkZC0zM2VhZTVmMGZjYTkiLCJpYXQiOjE3NDkwMTQyMzZ9.thMwL3SFDY5gcUEx4-LWSSY-GqLRsvU8qz3kKInwdbc`,
    );
    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };
  }, [roomId]);

  if (!socket) {
    return (
      <div>
        <h1>Connecting to the server</h1>
      </div>
    );
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
