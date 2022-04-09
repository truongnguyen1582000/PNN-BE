const mongoose = require('mongoose');

const Comment = new mongoose.Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    content: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', Comment);
