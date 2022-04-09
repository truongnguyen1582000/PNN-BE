const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username) {
      return res.status(401).json({
        message: 'Please enter your username',
      });
    }
    if (!email) {
      return res.status(401).json({
        message: 'Please enter your email',
      });
    }
    if (!password) {
      return res.status(401).json({
        message: 'Please enter your password',
      });
    }

    if (!confirmPassword) {
      return res.status(401).json({
        message: 'Please enter your confirm password',
      });
    }

    if (confirmPassword !== password) {
      return res.status(401).json({
        message: "Password doesn't match",
      });
    }

    const isExist = await User.findOne({ email: email });

    if (isExist) {
      return res.status(400).json({
        message: 'This email address is already being used',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({
      message: 'Create account successfully',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(401).json({
      message: 'Please enter your email and password',
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: 'Your email or password is invalid',
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: 'Your email or password is invalid',
      });
    }

    const payload = {
      userId: user.id,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY);

    user.password = null;

    res.status(200).json({
      userInfo: user,
      token,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
