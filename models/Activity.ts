import mongoose from "mongoose"

export interface IActivity extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  userName: string
  action: "add" | "remove" | "update" | "retrieve" | "move" | "waste"
  itemId: string
  itemName: string
  containerId: string
  details: string
  timestamp: Date
}

const ActivitySchema = new mongoose.Schema<IActivity>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user ID"],
    },
    userName: {
      type: String,
      required: [true, "Please provide user name"],
    },
    action: {
      type: String,
      enum: ["add", "remove", "update", "retrieve", "move", "waste"],
      required: [true, "Please provide action"],
    },
    itemId: {
      type: String,
      required: [true, "Please provide item ID"],
    },
    itemName: {
      type: String,
      required: [true, "Please provide item name"],
    },
    containerId: {
      type: String,
      required: [true, "Please provide container ID"],
    },
    details: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema)
