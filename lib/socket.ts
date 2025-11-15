/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";

// In-memory event emitter for broadcasting notifications
class NotificationBroadcaster extends EventEmitter {
  private roomSubscriptions: Map<string, Set<string>> = new Map();

  joinRoom(userId: string, room: string) {
    if (!this.roomSubscriptions.has(room)) {
      this.roomSubscriptions.set(room, new Set());
    }
    this.roomSubscriptions.get(room)?.add(userId);
    console.log("[v0] User joined room:", { userId, room });
  }

  broadcastToRoom(room: string, eventType: string, data: any) {
    console.log("[v0] Broadcasting to room:", {
      room,
      eventType,
      dataTitle: data?.title,
    });
    this.emit(`${room}:${eventType}`, data);
  }

  emitNotification(
    audienceType: "ALL" | "ROLE" | "USER",
    data: any,
    roles?: string[],
    userIds?: string[]
  ) {
    console.log("[v0] Emitting notification:", {
      audienceType,
      roles,
      userIds,
    });

    if (audienceType === "ALL") {
      this.broadcastToRoom("ALL", "notification", data);
    } else if (audienceType === "ROLE" && roles?.length) {
      roles.forEach((role) => {
        this.broadcastToRoom(`ROLE_${role}`, "notification", data);
      });
    } else if (audienceType === "USER" && userIds?.length) {
      userIds.forEach((userId) => {
        this.broadcastToRoom(`USER_${userId}`, "notification", data);
      });
    }
  }
}

export const notificationBroadcaster = new NotificationBroadcaster();

export function emitNotification(
  audienceType: "ALL" | "ROLE" | "USER",
  data: any,
  roles?: string[],
  userIds?: string[]
) {
  notificationBroadcaster.emitNotification(audienceType, data, roles, userIds);
}

export function emitToNotificationRooms(
  audienceType: "ALL" | "ROLE" | "USER",
  roles?: string[],
  userIds?: string[],
  // eventName: string = 'notification',
  data?: any
) {
  notificationBroadcaster.emitNotification(audienceType, data, roles, userIds);
}

export function getIO() {
  return notificationBroadcaster;
}
