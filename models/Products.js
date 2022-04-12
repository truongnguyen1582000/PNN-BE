const mongoose = require('mongoose');

const Product = new mongoose.Schema(
  {
    shopOwner: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: 'User',
    },
    name: {
      type: String,
      require: true,
      minlength: 6,
    },
    desciption: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
      default: '',
    },
    price: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('product', Product);
