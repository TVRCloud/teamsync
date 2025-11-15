"use client";

import { useRecentAlerts } from "@/hooks/useNotifications";

const NotificationsMain = () => {
  const { data, isLoading } = useRecentAlerts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default NotificationsMain;
