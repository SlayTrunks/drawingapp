"use client";
import { useEffect, useState, useRef, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

// Utility to get JWT token from localStorage
function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

type Message = {
  id: number;
  message: string;
  userId: string;
  createdAt: string;
};

export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<string>("Connecting...");
  const [error, setError] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch previous messages
  useEffect(() => {
    async function fetchMessages() {
      setStatus("Loading previous messages...");
      setError("");
      try {
        const res = await fetch(`http://localhost:3000/chats/${roomId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid messages format");
        setMessages(data.reverse());
        setStatus("Connected");
      } catch (err) {
        setError("Failed to load messages. " + (err instanceof Error ? err.message : ""));
        setStatus("Disconnected");
      }
    }
    fetchMessages();
  }, [roomId]);

  // WebSocket connection
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/signin");
      return;
    }

    setStatus("Connecting to chat server...");
    setError("");

    const wsUrl = `ws://localhost:8080?token=${token}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.debug("[WebSocket] Connection opened");
      setStatus("Connected");
      websocket.send(JSON.stringify({ type: "join_room", roomId }));
    };

    websocket.onclose = (event) => {
      console.debug("[WebSocket] Connection closed", event);
      setStatus("Disconnected");
    };

    websocket.onerror = (event) => {
      setError("WebSocket error. See console for details.");
      setStatus("Error");
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          // Debug log incoming message
          console.debug("[WebSocket] Received chat message:", data);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.floor(Math.random() * 1000), // Fallback for unique key
              message: data.message,
              userId: data.userId ?? "unknown",
              createdAt: new Date().toISOString(),
            },
          ]);
        } else {
          console.debug("[WebSocket] Received non-chat message:", data);
        }
      } catch (err) {
      }

    };

    setWs(websocket);

    return () => {
      try {
        // Only send if websocket is open
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({ type: "leave_room", roomId }));
        }
      } catch (err) {
        // Ignore errors on cleanup
      }
      websocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, router]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newMessage.trim()) return;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError("WebSocket is not connected.");
      return;
    }
    try {
      ws.send(JSON.stringify({ type: "chat", roomId, message: newMessage }));
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message. " + (err instanceof Error ? err.message : ""));
      console.error("[WebSocket] Send error:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-indigo-700 p-4 text-white">
        <h1 className="text-xl font-bold">Room {roomId}</h1>
        <span className={`ml-2 text-sm ${status === "Connected" ? "text-green-200" : "text-yellow-200"}`}>
          {status}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
        {messages.length === 0 && (
          <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-indigo-600">
                User {msg.userId?.slice?.(0, 6) ?? "unknown"}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-800">{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={status !== "Connected"}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            disabled={status !== "Connected"}
          >
            Send
          </button>
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-600">{error}</div>
        )}
      </form>
    </div>
  );
}

