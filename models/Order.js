const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    address: {},
    from: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'User',
    },
    to: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'User',
    },
    orderInfo: [],
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('order', schema);
