/* eslint-disable react-hooks/set-state-in-effect */
import { INotification } from "@/models/notification";
import {
  CreateNotificationInput,
  NotificationWithRead,
  UnreadCountResponse,
} from "@/types/notification";
import { useCallback, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import useSWR from "swr";

export function useCreateNotification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNotification = async (input: CreateNotificationInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error("Failed to create notification");
      }

      const data = await res.json();
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createNotification, isLoading, error };
}

export function useMarkRead() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markRead = async (userId: string, notificationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/notifications/mark-read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, notificationId }),
      });

      if (!res.ok) {
        throw new Error("Failed to mark notification as read");
      }

      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markAllRead = async (userId: string, userRole: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userRole }),
      });

      if (!res.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { markRead, markAllRead, isLoading, error };
}

export function useNotificationsSocket(userId: string, userRole: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newNotification, setNewNotification] = useState<INotification | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("[Socket] Connected:", newSocket.id);
      setIsConnected(true);

      // Join rooms
      newSocket.emit("join-rooms", { userId, role: userRole });
    });

    newSocket.on("notification", (data: INotification) => {
      console.log("[Socket] New notification received:", data);
      setNewNotification(data);
    });

    newSocket.on("disconnect", () => {
      console.log("[Socket] Disconnected");
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId, userRole]);

  return {
    socket,
    newNotification,
    isConnected,
  };
}

interface NotificationsResponse {
  data: NotificationWithRead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useNotifications(
  userId: string,
  userRole: string,
  page: number = 1,
  limit: number = 10
) {
  const [type, setType] = useState<string | undefined>();

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    userId,
    userRole,
  });

  if (type) {
    queryParams.append("type", type);
  }

  const { data, error, isLoading, mutate } = useSWR<NotificationsResponse>(
    `/api/notifications?${queryParams.toString()}`,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
    { revalidateOnFocus: false }
  );

  const filterByType = useCallback((filterType: string | undefined) => {
    setType(filterType);
  }, []);

  return {
    notifications: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
    filterByType,
  };
}

export function useUnreadCount(
  userId: string,
  userRole: string,
  interval: number = 30000
) {
  const queryParams = new URLSearchParams({
    userId,
    userRole,
  });

  const { data, mutate } = useSWR<UnreadCountResponse>(
    `/api/notifications/unread-count?${queryParams.toString()}`,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch unread count");
      return res.json();
    },
    { refreshInterval: interval, revalidateOnFocus: false }
  );

  return {
    unreadCount: data?.unreadCount || 0,
    totalCount: data?.totalCount || 0,
    mutate,
  };
}
