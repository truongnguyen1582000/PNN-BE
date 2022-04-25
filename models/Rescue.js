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

    status: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('rescue', schema);
