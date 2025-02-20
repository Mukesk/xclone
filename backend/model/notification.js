import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like", "comment"], // 🔥 Added "comment" for flexibility
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: function () {
        return this.type === "like" || this.type === "comment"; // Only required for like/comments
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String, // Optional message field
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
