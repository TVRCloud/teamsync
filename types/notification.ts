/* eslint-disable @typescript-eslint/no-explicit-any */

import { INotification } from "@/models/notification";

export interface NotificationWithRead {
  notification: INotification;
  read: boolean;
  readAt?: Date;
}

export interface UnreadCountResponse {
  unreadCount: number;
  totalCount: number;
}

export interface CreateNotificationInput {
  type: "BROADCAST" | "ROLE_BASED" | "DIRECT" | "SYSTEM" | "TASK";
  title: string;
  body: string;
  audienceType: "ALL" | "ROLE" | "USER";
  roles?: string[];
  users?: string[];
  meta?: Record<string, any>;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  type?: string;
}
