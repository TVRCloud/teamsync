"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { create } from "zustand";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (n: NotificationItem) => void;
  markAsRead: (id: string, userId: string) => void;
  setAll: (items: NotificationItem[]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (n) =>
    set((state) => ({ notifications: [n, ...state.notifications] })),
  markAsRead: (id, userId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, notificationId: id }),
    });
  },
  setAll: (items) => set({ notifications: items }),
}));

export const useNotificationStream = (user: {
  id: string;
  roles: string[];
}) => {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const es = new EventSource("/api/notifications/stream");

    es.onmessage = (event) => {
      const n = JSON.parse(event.data);

      let shouldReceive = false;
      if (n.audienceType === "ALL") shouldReceive = true;
      if (
        n.audienceType === "ROLE" &&
        n.roles?.some((r: string) => user.roles.includes(r))
      )
        shouldReceive = true;
      if (n.audienceType === "USER" && n.users?.includes(user.id))
        shouldReceive = true;

      if (shouldReceive) {
        addNotification({
          id: n._id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt,
          read: false,
        });

        toast.success(n.title, { description: n.body });
      }
    };

    es.onerror = () => console.error("Notification stream error");

    return () => es.close();
  }, [user, addNotification]);
};
