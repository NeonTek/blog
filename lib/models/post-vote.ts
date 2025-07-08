/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import mongoose, { Schema, models } from "mongoose"

const PostVoteSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create a compound index to ensure a user can only have one vote per post
PostVoteSchema.index({ postId: 1, userId: 1 }, { unique: true })

export default models.PostVote || mongoose.model("PostVote", PostVoteSchema)
