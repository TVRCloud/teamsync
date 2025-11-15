"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { NotificationCard } from "./notification-card";
import { motion } from "framer-motion";
import { useNotifications, useUnreadCount } from "@/hooks/useNotification";

interface NotificationPanelProps {
  userId: string;
  userRole: string;
  onClose: () => void;
}

export function NotificationPanel({
  userId,
  userRole,
  onClose,
}: NotificationPanelProps) {
  const [page] = useState(1);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const { notifications, isLoading } = useNotifications(
    userId,
    userRole,
    page,
    5
  );
  const { unreadCount } = useUnreadCount(userId, userRole);

  const displayNotifications =
    tab === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <Card className="w-96 shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(v) => setTab(v as "all" | "unread")}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex-1">
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading...
              </div>
            ) : displayNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              <motion.div>
                {displayNotifications.map((item, idx) => (
                  <motion.div
                    key={item.notification._id.toString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <NotificationCard
                      notification={item.notification}
                      isRead={item.read}
                      userId={userId}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="unread" className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading...
              </div>
            ) : displayNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No unread notifications
              </div>
            ) : (
              <motion.div>
                {displayNotifications.map((item, idx) => (
                  <motion.div
                    key={item.notification._id.toString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <NotificationCard
                      notification={item.notification}
                      isRead={item.read}
                      userId={userId}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t p-4">
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>
    </Card>
  );
}
