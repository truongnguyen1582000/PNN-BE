const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const schema = new mongoose.Schema(
  {
    // title: {
    //   type: String,
    //   required: false,
    // },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: 'User',
    },
    // desc: {
    //   type: String,
    //   max: 500,
    // },
    imgUrl: {
      type: String,
    },
    // attachment: String,
    likes: [
      {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: 'User',
      },
    ],
    type: {
      type: String,
      default: 'nornal',
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
