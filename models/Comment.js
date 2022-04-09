const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", Comment);
