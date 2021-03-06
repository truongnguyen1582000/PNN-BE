const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    avatar: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: '',
    },
    quote: {
      type: String,
      default:
        'Dogs and angels are not very far apart. - Charles Bukowski, German American Writer',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
