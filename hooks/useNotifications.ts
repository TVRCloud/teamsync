"use client";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useEffect } from "react";
import { toast } from "sonner";

export function useNotifications(user: { id: string; roles: string[] }) {
  useEffect(() => {
    const ev = new EventSource("/api/notifications/stream");

    ev.onmessage = (msg) => {
      if (msg.data === "ping") return;

      const event = JSON.parse(msg.data);

      if (event.type === "NEW") {
        const n = event.payload;

        let shouldReceive = false;

        if (n.audienceType === "ALL") shouldReceive = true;
        if (n.audienceType === "ROLE" && n.roles?.includes(user.roles[0]))
          shouldReceive = true;
        if (n.audienceType === "USER" && n.users?.includes(user.id))
          shouldReceive = true;

        if (shouldReceive) {
          toast(n.title, { description: n.body });
        }
      }
    };

    return () => ev.close();
  }, [user]);
}

export function useNotificationStream(user: { id: string; roles: string[] }) {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const es = new EventSource("/api/notifications/stream");

    es.onmessage = (msg) => {
      const event = JSON.parse(msg.data);
      if (event.type !== "NEW") return;

      const n = event.payload;

      let shouldReceive = false;
      if (n.audienceType === "ALL") shouldReceive = true;
      if (n.audienceType === "ROLE" && n.roles?.includes(user.roles[0]))
        shouldReceive = true;
      if (n.audienceType === "USER" && n.users?.includes(user.id))
        shouldReceive = true;

      if (shouldReceive) {
        addNotification({
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
    };

    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
}
