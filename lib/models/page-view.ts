/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import mongoose, { Schema, models } from "mongoose"

const PageViewSchema = new Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userAgent: {
      type: String,
      default: "",
    },
    ip: {
      type: String,
      default: "",
    },
    referrer: {
      type: String,
      default: "",
    },
    sessionId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient querying
PageViewSchema.index({ path: 1, createdAt: -1 })
PageViewSchema.index({ userId: 1, createdAt: -1 })
PageViewSchema.index({ sessionId: 1 })
PageViewSchema.index({ createdAt: 1 })
PageViewSchema.index({ userAgent: 1 }) // Enables better aggregation by userAgent

export default models.PageView || mongoose.model("PageView", PageViewSchema)
