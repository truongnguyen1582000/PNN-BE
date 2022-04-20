const express = require('express');
const router = express.Router();
const GroupOrder = require('../models/GroupOrder');
const { verifyToken } = require('../middleware/auth');

// add item to group order
router.post('/add/:id', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findById(req.params.id);
    if (!groupOrder) {
      return res.status(404).json({
        message: 'Group order not found',
      });
    }

    const item = {
      addedBy: req.payload.userId,
      items: {
        product: req.body.productId,
        quantity: 1,
      },
    };

    // if already exist, update quantity
    const index = groupOrder.info.findIndex(
      (info) => info.addedBy.toString() === req.payload.userId
    );
    if (index !== -1) {
      const itemIndex = groupOrder.info[index].items.findIndex(
        (item) => item.product.toString() === req.body.productId
      );
      if (itemIndex !== -1) {
        groupOrder.info[index].items[itemIndex].quantity += 1;
      } else {
        groupOrder.info[index].items.push(item);
      }
    } else {
      groupOrder.info.push(item);
    }

    await groupOrder.save();
    return res.status(200).json({
      data: groupOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// create group order
router.post('/', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.create({
      cartOwner: req.payload.userId,
      name: req.body.name,
      info: [],
    });
    return res.status(200).json({
      data: groupOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

//get group order
router.get('/', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.find({
      cartOwner: req.payload.userId,
    })
      .populate('cartOwner')
      .populate('info.addedBy')
      .populate('info.items.product');
    return res.status(200).json({
      data: groupOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
