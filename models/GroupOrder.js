const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupOrder = new mongoose.Schema(
  {
    cartOwner: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: 'User',
    },

    name: {
      type: String,
      default: null,
    },

    shareTo: [
      {
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'User',
      },
    ],

    info: [
      {
        addedBy: {
          type: mongoose.Types.ObjectId,
          default: null,
          ref: 'User',
        },
        items: [
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
      },
    ],

    isShareable: {
      type: Boolean,
      default: true,
    },

    limitMoney: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GroupOrder', GroupOrder);
