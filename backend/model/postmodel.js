import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    img: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    comments: [
      {
        text: { type: String },
        user: { type:Object },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Posts", postSchema); // Changed "Posts" to "Post" for consistency
export default Post;
