const mongoose = require('mongoose');
const addressModel = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    default: null,
    ref: 'User',
  },
  addressList: [
    {
      addressDetail: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('address', addressModel);
