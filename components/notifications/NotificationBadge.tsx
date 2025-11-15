"use client";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationBadge({
  onClick,
}: {
  onClick: () => void;
}) {
  const notifications = useNotificationStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-muted transition"
    >
      <Bell className="w-6 h-6" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center bg-red-600 text-white rounded-full">
          {unread}
        </span>
      )}
    </button>
  );
}
