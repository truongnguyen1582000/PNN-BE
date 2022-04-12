const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new mongoose.Schema(
  {
    cartOwner: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: 'User',
    },

    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'product',
        },
        quantity: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],

    sharedTo: [
      {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: 'User',
      },
    ],

    token: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('cart', Cart);
