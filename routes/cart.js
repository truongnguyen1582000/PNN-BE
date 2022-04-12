const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.post('/addToCart', async (req, res) => {
  const number = req.body.number || 1;
  try {
    const cart = await Cart.findOne({
      cartOwner: req.body.userId,
    });
    if (cart) {
      const product = cart.cartItems.find(
        (item) => item.product.toString() === req.body.productId
      );
      if (product) {
        product.quantity += number;
        await cart.save();
      } else {
        cart.cartItems.push({
          product: req.body.productId,
          quantity: number,
        });
        await cart.save();
      }
    } else {
      const newCart = new Cart({
        cartOwner: req.body.userId,
        cartItems: [
          {
            product: req.body.productId,
            quantity: number,
          },
        ],
      });
      await newCart.save();
    }
    return res.status(200).json({
      message: 'Product added to cart',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.post('/removeFromCart', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      cartOwner: req.body.userId,
    });
    if (cart) {
      const product = cart.cartItems.find(
        (item) => item.product.toString() === req.body.productId
      );
      if (product) {
        cart.cartItems.splice(cart.cartItems.indexOf(product), 1);
        await cart.save();
      }
    }
    return res.status(200).json({
      message: 'Product removed from cart',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/', async (request, response) => {
  try {
    const carts = await Cart.find({})
      .populate('cartOwner')
      .populate('sharedTo')
      .populate('cartItems.product', 'name price');
    return response.status(200).json({
      carts,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
