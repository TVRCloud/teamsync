/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { NotificationBell } from "@/components/notification/notification-bell";
import { NotificationForm } from "@/components/notification/notification-form";
import { useUnreadCount } from "@/hooks/useNotification";
import { useState, useEffect } from "react";

// Demo user setup
const DEMO_USER_ID = "user-123";
const DEMO_USER_ROLE = "admin";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { unreadCount } = useUnreadCount(DEMO_USER_ID, DEMO_USER_ROLE);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-linear-to-br from-background to-muted p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header with notification bell */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Enterprise Notification System
            </h1>
            <p className="text-muted-foreground">
              Real-time notifications with Socket.IO, MongoDB & React
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                User: {DEMO_USER_ID}
              </p>
              <p className="text-sm text-muted-foreground">
                Role: {DEMO_USER_ROLE}
              </p>
            </div>
            <NotificationBell userId={DEMO_USER_ID} userRole={DEMO_USER_ROLE} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-card p-6 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">Unread Count</p>
            <p className="text-3xl font-bold text-primary">{unreadCount}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <p className="text-lg font-semibold">Active</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">System</p>
            <p className="text-lg font-semibold">Running</p>
          </div>
        </div>

        {/* Notification Form */}
        <div className="mb-12">
          <NotificationForm />
        </div>

        {/* Info section */}
        <div className="bg-card p-8 rounded-lg border space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="grid grid-cols-2 gap-4">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Real-time Socket.IO updates</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Broadcast notifications (ALL)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Role-based notifications</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Direct user notifications</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Unread/read tracking</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Infinite scroll pagination</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Architecture Highlights</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • Notification + NotificationRead pattern prevents document
                growth
              </li>
              <li>• Compound indexes on MongoDB for O(1) query performance</li>
              <li>
                • Socket.IO rooms for efficient real-time targeting (ALL,
                ROLE_*, USER_*)
              </li>
              <li>• React Query + SWR for client-side caching and sync</li>
              <li>• Framer Motion animations for smooth UX</li>
              <li>• Fully type-safe with TypeScript and Zod validation</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
