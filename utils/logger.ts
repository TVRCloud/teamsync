/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/lib/mongodb";
import ActivityLog from "@/models/log";

export interface LogActivityParams {
  userId: string;
  action:
    | "create"
    | "update"
    | "delete"
    | "comment"
    | "assign"
    | "status_change"
    | "priority_change"
    | "login"
    | "logout";
  entityType: "task" | "project" | "team" | "user" | "comment";
  entityId: string;
  message: string;
  metadata?: Record<string, any>;
}

export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  message,
  metadata = {},
}: LogActivityParams) {
  try {
    await connectDB();
    await ActivityLog.create({
      user: userId,
      action,
      entityType,
      entityId,
      message,
      metadata,
    });
  } catch (error) {
    console.error("[v0] Failed to log activity:", error);
  }
}
