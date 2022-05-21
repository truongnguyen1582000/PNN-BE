const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Order = require('../models/Order');
const GroupOrder = require('../models/GroupOrder');

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

module.exports = router;
