const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: 'User',
    },

    imgUrl: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: 'User',
      },
    ],
    type: {
      type: String,
      enum: ['Rescue', 'Post'],
      default: 'Post',
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    comments: [
      {
        commentBy: {
          type: mongoose.Types.ObjectId,
          default: null,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],

    bookmark: [
      {
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('post', schema);
