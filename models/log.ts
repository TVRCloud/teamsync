import { Schema, model, models } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      required: true,
      enum: [
        "create",
        "update",
        "delete",
        "comment",
        "assign",
        "status_change",
        "priority_change",
        "login",
        "logout",
        "other",
      ],
      default: "other",
    },
    entityType: {
      type: String,
      required: true,
      enum: [
        "task",
        "project",
        "team",
        "user",
        "comment",
        "workspace",
        "timesheet",
        "setting",
      ],
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      // store extra info (e.g., previous values, status change details)
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default models.ActivityLog || model("ActivityLog", ActivityLogSchema);
