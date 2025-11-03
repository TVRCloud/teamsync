import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "Users" },
    // team: { type: Schema.Types.ObjectId, ref: "Teams" },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export default models.Projects || model("Projects", ProjectSchema, "projects");
