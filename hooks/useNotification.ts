/* eslint-disable react-hooks/exhaustive-deps */
import { INotification } from "@/models/notification";
import {
  CreateNotificationInput,
  NotificationWithRead,
  UnreadCountResponse,
} from "@/types/notification";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
  const [newNotification, setNewNotification] = useState<INotification | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(true);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  useEffect(() => {
    if (isPollingRef.current) {
      console.log("[v0] Polling already active");
      return;
    }

    isPollingRef.current = true;
    setIsConnected(true);

    console.log("[v0] Starting notification polling:", { userId, userRole });

    const poll = async () => {
      try {
        const response = await fetch(
          `/api/socket-listener?userId=${encodeURIComponent(
            userId
          )}&userRole=${encodeURIComponent(userRole)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          console.error("[v0] Poll error:", response.status);
          return;
        }

        const data = await response.json();

        if (data.received && data.notification) {
          console.log(
            "[v0] Notification received via polling:",
            data.notification.title
          );
          setNewNotification(data.notification);

          toast.success(data.notification.title, {
            description: data.notification.body,
            duration: 4000,
          });
        }
      } catch (error) {
        console.error("[v0] Polling error:", error);
      }
    };

    // Start polling immediately and then every request
    const startPolling = async () => {
      while (isPollingRef.current) {
        await poll();
      }
    };

    startPolling();

    return () => {
      console.log("[v0] Stopping notification polling");
      isPollingRef.current = false;
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, [userId, userRole]);

  return {
    socket: null,
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

  const { newNotification } = useNotificationsSocket(userId, userRole);

  useEffect(() => {
    // When a new notification arrives via socket, revalidate the unread count
    if (newNotification) {
      console.log("[v0] New notification received, updating unread count");
      mutate();
    }
  }, [newNotification, mutate]);

  return {
    unreadCount: data?.unreadCount || 0,
    totalCount: data?.totalCount || 0,
    mutate,
  };
}
