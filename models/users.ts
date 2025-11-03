import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "member", "guest"],
      default: "member",
    },
    avatar: { type: String },
    teams: [{ type: Schema.Types.ObjectId, ref: "Teams" }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default models.Users || model("Users", UserSchema, "users");
