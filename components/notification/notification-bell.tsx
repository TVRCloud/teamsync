"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useUnreadCount } from "@/hooks/useNotification";
import { NotificationPanel } from "./notification-panel";

interface NotificationBellProps {
  userId: string;
  userRole: string;
}

export function NotificationBell({ userId, userRole }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useUnreadCount(userId, userRole);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 z-50"
          >
            <NotificationPanel
              userId={userId}
              userRole={userRole}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
