/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as HTTPServer } from "http";
import { Server as IOServer, Socket } from "socket.io";

let io: IOServer | null = null;

export function initSocketServer(httpServer: HTTPServer) {
  if (io) return io;

  io = new IOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    console.log("[v0] Socket connected:", socket.id);

    socket.on("join-rooms", (data: { userId: string; role: string }) => {
      socket.join("ALL");
      socket.join(`ROLE_${data.role}`);
      socket.join(`USER_${data.userId}`);
      console.log("[v0] User joined rooms:", {
        userId: data.userId,
        role: data.role,
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
    throw new Error("[v0] Socket.IO not initialized");
  }
  return io;
}

export function emitNotification(
  audienceType: "ALL" | "ROLE" | "USER",
  data: any,
  roles?: string[],
  userIds?: string[]
) {
  if (!io) {
    console.error("[v0] Socket.IO not available for emit");
    return;
  }

  console.log("[v0] Emitting notification:", { audienceType, roles, userIds });

  if (audienceType === "ALL") {
    io.to("ALL").emit("notification", data);
  } else if (audienceType === "ROLE" && roles?.length) {
    roles.forEach((role) => {
      io?.to(`ROLE_${role}`).emit("notification", data);
    });
  } else if (audienceType === "USER" && userIds?.length) {
    userIds.forEach((userId) => {
      io?.to(`USER_${userId}`).emit("notification", data);
    });
  }
}
