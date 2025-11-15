import { Server as IOServer } from "socket.io";
import { NextResponse } from "next/server";

// Global socket instance
let io: IOServer | null = null;

function initializeSocket() {
  if (io) return io;

  console.log("[v0] Initializing Socket.IO server...");

  io = new IOServer({
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("[v0] Socket connected:", socket.id);

    socket.on("join-rooms", (data: { userId: string; role: string }) => {
      socket.join("ALL");
      socket.join(`ROLE_${data.role}`);
      socket.join(`USER_${data.userId}`);
      console.log("[v0] User joined rooms:", {
        userId: data.userId,
        role: data.role,
        socketId: socket.id,
      });
    });

    socket.on("disconnect", () => {
      console.log("[v0] Socket disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    initializeSocket();
  }
  return io;
}

export async function POST() {
  try {
    const ioInstance = getIO();
    return NextResponse.json({
      status: "Socket.IO initialized",
      socketReady: !!ioInstance,
    });
  } catch (error) {
    console.error("[v0] Socket init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize socket" },
      { status: 500 }
    );
  }
}
