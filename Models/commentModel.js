import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Posts",
    },
    comment: String,
    likes: [],
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("comment", commentSchema);
export default CommentModel;
