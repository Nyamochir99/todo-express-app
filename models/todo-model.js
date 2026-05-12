import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  _id: { type: String },
  task: { type: String, required: true },
  checked: { type: Boolean, required: true, default: false },
  userId: { type: String, required: true },
});
export const UserModel = mongoose.model("todos", TodoSchema);
