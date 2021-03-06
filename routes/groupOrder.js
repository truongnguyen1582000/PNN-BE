const express = require('express');
const router = express.Router();
const GroupOrder = require('../models/GroupOrder');
const Product = require('../models/Products');
const { verifyToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// api leave group order
router.delete('/leave/:id', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findById(req.params.id);
    if (!groupOrder) {
      return res.status(404).json({
        message: 'Group order not found',
      });
    }

    const index = groupOrder.shareTo.findIndex((e) => e === req.payload.userId);

    groupOrder.shareTo.splice(index, 1);

    // delete my cart info in group order
    const idx = groupOrder.info.findIndex(
      (e) => e.addedBy === req.payload.userId
    );
    groupOrder.info.splice(idx, 1);

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

// add item to group order
router.post('/add/:id', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findById(req.params.id).populate(
      'info.items.product'
    );

    // if isShareab is false, only cart owner can add item to group order
    if (
      !groupOrder.isShareable &&
      req.payload.userId !== groupOrder.cartOwner.toString()
    ) {
      return res.status(400).json({
        message: 'You are not allowed to add item to this group order',
      });
    }

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

    const index = groupOrder.info.findIndex(
      (info) => info.addedBy.toString() === req.payload.userId.toString()
    );

    if (
      groupOrder.limitMoney !== 0 &&
      groupOrder.cartOwner.toString() !== req.payload.userId
    ) {
      const product = await Product.findById(req.body.productId);
      if (product.price > groupOrder.limitMoney) {
        return res.status(400).json({
          message: 'You have reached the limit money',
        });
      }

      const totalPrice =
        groupOrder.info[index]?.items.reduce(
          (total, item) => total + item.quantity * item.product.price,
          0
        ) + product.price;
      if (totalPrice > groupOrder.limitMoney) {
        return res.status(400).json({
          message: 'You have reached the limit money',
        });
      }
    }

    if (index !== -1) {
      const itemIndex = groupOrder.info[index].items.findIndex(
        (item) => item.product._id.toString() === req.body.productId
      );
      if (itemIndex !== -1) {
        groupOrder.info[index].items[itemIndex].quantity += 1;
      } else {
        groupOrder.info[index].items.push(item.items);
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
      info: [
        {
          addedBy: req.payload.userId,
          items: [],
        },
      ],
    });
    return res.status(200).json({
      data: groupOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

//get group order
router.get('/', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.find()
      .populate('cartOwner')
      .populate('info.addedBy')
      .populate('info.items.product');

    const result = groupOrder.filter(
      (groupOrder) =>
        groupOrder.cartOwner._id.toString() === req.payload.userId.toString() ||
        groupOrder.shareTo.some(
          (user) => user.toString() === req.payload.userId.toString()
        )
    );
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/shareToken/:id', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findOne({
      _id: req.params.id,
    });

    groupOrder.save();
    const token = jwt.sign(
      { groupOrderId: req.params.id },
      process.env.SECRET_KEY
    );
    res.status(200).json({
      data: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.post('/setLimitMoney', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findOne({
      _id: req.body.cartId,
    });
    if (groupOrder) {
      if (req.body.limitMoney === 0) {
        groupOrder.limitMoney = null;
      }

      groupOrder.limitMoney = req.body.limitMoney;
      await groupOrder.save();
      return res.status(200).json({
        message: 'Limit money set',
      });
    }
    return res.status(400).json({
      message: 'Group order not found',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// delete group order
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findById(req.params.id);
    if (!groupOrder) {
      return res.status(404).json({
        message: 'Group order not found',
      });
    }
    await groupOrder.remove();
    return res.status(200).json({
      message: 'Group order deleted',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// delete item from group order
router.delete('/:id/:itemId', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findById(req.params.id);
    if (!groupOrder) {
      return res.status(404).json({
        message: 'Group order not found',
      });
    }

    const index = groupOrder.info.findIndex(
      (info) => info.addedBy.toString() === req.payload.userId.toString()
    );

    if (index !== -1) {
      const itemIndex = groupOrder.info[index].items.findIndex(
        (item) => item.product.toString() === req.params.itemId
      );
      if (itemIndex !== -1) {
        groupOrder.info[index].items.splice(itemIndex, 1);
      }
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

// api add more item to group order
router.post('/addMoreItem/:id/:itemId', verifyToken, async (req, res) => {
  const number = req.body.number || 1;
  try {
    const groupOrder = await GroupOrder.findById(req.params.id).populate(
      'info.items.product'
    );

    if (!groupOrder) {
      return res.status(404).json({
        message: 'Group order not found',
      });
    }

    const index = groupOrder.info.findIndex(
      (info) => info.addedBy.toString() === req.payload.userId.toString()
    );

    if (
      groupOrder.limitMoney !== 0 &&
      number !== -1 &&
      groupOrder.cartOwner.toString() !== req.payload.userId
    ) {
      const product = await Product.findById(req.params.itemId);

      const totalPrice =
        groupOrder.info[index].items.reduce(
          (total, item) => total + item.quantity * item.product.price,
          0
        ) + product.price;

      if (totalPrice > groupOrder.limitMoney) {
        return res.status(400).json({
          message: 'You have reached the limit money',
        });
      }
    }

    if (index !== -1) {
      const itemIndex = groupOrder.info[index].items.findIndex(
        (item) => item.product._id.toString() === req.params.itemId
      );

      if (itemIndex !== -1) {
        // if quantity < 0 then delete item
        if (groupOrder.info[index].items[itemIndex].quantity + number === 0) {
          groupOrder.info[index].items.splice(itemIndex, 1);
        } else {
          groupOrder.info[index].items[itemIndex].quantity += number;
        }
      } else {
        groupOrder.info[index].items.push({
          product: req.params.itemId,
          quantity: 1,
        });
      }
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

router.get('/getGroupOrder/:token', verifyToken, async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({
        message: 'Token is invalid',
      });
    }

    const groupOrder = await GroupOrder.findOne({
      _id: decoded.groupOrderId,
    });

    // if share to already have this user
    if (
      groupOrder.shareTo.some((user) => user.toString() === req.payload.userId)
    ) {
      return res.status(203).json({
        message: "You've already join this group order",
      });
    }

    groupOrder.shareTo.push(req.payload.userId);

    groupOrder.save();

    if (groupOrder) {
      return res.status(200).json({
        data: groupOrder,
      });
    }
    return res.status(404).json({
      message: 'Cart not found',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// change status of isShareable
router.put('/changeShareStatus/:id', verifyToken, async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findById(req.params.id);
    if (!groupOrder) {
      return res.status(404).json({
        message: 'Group order not found',
      });
    }
    groupOrder.isShareable = !groupOrder.isShareable;
    await groupOrder.save();
    return res.status(200).json({
      message: 'Status changed',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
