import mongoose from "mongoose";

export function isValidObjectId(id: string | unknown): id is string {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

export function toObjectId(id: string | unknown): mongoose.Types.ObjectId {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new mongoose.Types.ObjectId(id);
}
