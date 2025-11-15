/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, models, model } from "mongoose";

export type NotificationType =
  | "BROADCAST"
  | "ROLE_BASED"
  | "DIRECT"
  | "SYSTEM"
  | "TASK";
export type AudienceType = "ALL" | "ROLE" | "USER";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  audienceType: AudienceType;
  roles?: string[];
  users?: mongoose.Types.ObjectId[];
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["BROADCAST", "ROLE_BASED", "DIRECT", "SYSTEM", "TASK"],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    audienceType: {
      type: String,
      enum: ["ALL", "ROLE", "USER"],
      required: true,
    },
    roles: [{ type: String }],
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ audienceType: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ roles: 1 });
notificationSchema.index({ users: 1 });

export const Notification =
  models.Notification ||
  model<INotification>("Notification", notificationSchema);
