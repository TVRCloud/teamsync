/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as HTTPServer } from "http";
import { Server as IOServer, Socket } from "socket.io";

let io: IOServer | null = null;

export function initSocket(httpServer: HTTPServer) {
  if (io) return io;

  io = new IOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    console.log("[Socket] User connected:", socket.id);

    // Listen for room joins
    socket.on("join-rooms", (data: { userId: string; role: string }) => {
      // Join global room
      socket.join("ALL");

      // Join role room
      socket.join(`ROLE_${data.role}`);

      // Join user-specific room
      socket.join(`USER_${data.userId}`);

      console.log(
        `[Socket] User joined rooms - userId: ${data.userId}, role: ${data.role}`
      );
    });

    socket.on("disconnect", () => {
      console.log("[Socket] User disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

export function emitToNotificationRooms(
  audienceType: "ALL" | "ROLE" | "USER",
  roles?: string[],
  userIds?: string[],
  eventName: string = "notification",
  data?: any
) {
  if (!io) return;

  if (audienceType === "ALL") {
    io.to("ALL").emit(eventName, data);
  } else if (audienceType === "ROLE" && roles) {
    roles.forEach((role) => {
      io?.to(`ROLE_${role}`).emit(eventName, data);
    });
  } else if (audienceType === "USER" && userIds) {
    userIds.forEach((userId) => {
      io?.to(`USER_${userId}`).emit(eventName, data);
    });
  }
}
