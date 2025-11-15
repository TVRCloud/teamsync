"use client";

import { useMarkRead } from "@/hooks/useNotification";
import { INotification } from "@/models/notification";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface NotificationCardProps {
  notification: INotification;
  isRead: boolean;
  userId: string;
}

export function NotificationCard({
  notification,
  isRead,
  userId,
}: NotificationCardProps) {
  const { markRead } = useMarkRead();

  const handleMarkRead = async () => {
    if (!isRead) {
      await markRead(userId, notification._id.toString());
    }
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      onClick={handleMarkRead}
      className={`p-4 border-b cursor-pointer transition-colors ${
        !isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{notification.title}</h3>
            {!isRead && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.body}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {notification.type && (
              <span className="text-xs px-2 py-1 bg-muted rounded">
                {notification.type}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(notification.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {!isRead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="shrink-0"
          >
            <Check className="h-5 w-5 text-blue-500" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
