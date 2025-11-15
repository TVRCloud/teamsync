import mongoose, { Schema, Document, models, model } from "mongoose";

export interface INotificationRead extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  notificationId: mongoose.Types.ObjectId;
  readAt: Date;
  createdAt: Date;
}

const notificationReadSchema = new Schema<INotificationRead>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    readAt: { type: Date, required: true },
  },
  { timestamps: true }
);

notificationReadSchema.index(
  { userId: 1, notificationId: 1 },
  { unique: true }
);
notificationReadSchema.index({ userId: 1, readAt: -1 });
notificationReadSchema.index({ createdAt: -1 });

export const NotificationRead =
  models.NotificationRead ||
  model<INotificationRead>("NotificationRead", notificationReadSchema);
