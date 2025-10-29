import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);
