const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const GroupOrder = require('../models/GroupOrder');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trung77vippro@gmail.com',
    pass: 'fpzyhelvvdbkqvzz',
  },
});

const router = express.Router();

// create new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const order = new Order({
      address: req.body.address,
      from: req.payload.userId,
      to: req.body.to,
      orderInfo: req.body.orderInfo,
      message: req.body.message,
    });

    const shopInfo = await User.findById(req.body.to);
    const userOrderInfo = await User.findById(req.payload.userId);

    const mailOptions = {
      from: 'Admin',
      to: shopInfo.email,
      subject: 'PPN - New Order',
      html: `<p> You have a new order from user ${userOrderInfo.username}, Let check it in: <a href="http://localhost:3000/home-page/shop">Here<a></p>
          <p>Thanks</p>`,
    };

    transporter.sendMail(mailOptions);

    // delete group order
    await GroupOrder.findOneAndDelete({
      _id: req.body.cart,
    });

    await order.save();
    res.status(200).json({
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// get my orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({
      from: req.payload.userId,
    })
      .populate('from')
      .populate('to')
      .sort({ createdAt: -1 });
    res.status(200).json({
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// get shop order
router.get('/shop', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({
      to: req.payload.userId,
    });
    res.status(200).json({
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// update status
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        status: req.body.status,
      }
    );
    res.status(200).json({
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// delete order
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Order.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(200).json({
      message: 'Order deleted',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
