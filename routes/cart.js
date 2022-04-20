const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/auth');

// router.post('/addToCart/:cartId', verifyToken, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({
//       _id: req.params.cartId,
//     });
//     if (cart) {
//       const product = cart.cartItems.find(
//         (item) => item.product.toString() === req.body.productId
//       );

//       if (product) {
//         product.quantity += 1;
//       } else {
//         cart.cartItems.push({
//           product: req.body.productId,
//           quantity: 1,
//           addedBy: req.payload.userId,
//         });
//       }
//       await cart.save();
//       return res.status(200).json({
//         message: 'Product added to cart',
//       });
//     }
//     return res.status(400).json({
//       message: 'Cart not found',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// });

router.post('/addToCart', verifyToken, async (req, res) => {
  const number = +req.body.number || 1;

  try {
    const cart = await Cart.findOne({ cartOwner: req.payload.userId });

    if (cart) {
      const product = cart.cartItems.find(
        (item) => item.product.toString() === req.body.productId.toString()
      );
      if (product) {
        product.quantity += number;
        if (product.quantity < 1) {
          cart.cartItems.splice(cart.cartItems.indexOf(product), 1);
        }
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
        cartOwner: req.payload.userId,
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

router.post('/removeFromCart', verifyToken, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      cartOwner: req.body.userId,
    });
    if (cart) {
      const product = cart.cartItems.find(
        (item) => item.product.toString() === req.body.productId.toString()
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

// router.get('/shareToken', verifyToken, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({
//       cartOwner: req.payload.userId,
//     });

//     cart.isShareable = true;
//     cart.save();
//     const token = jwt.sign({ cardId: cart._id }, process.env.SECRET_KEY);
//     res.status(200).json({
//       data: token,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// router.get('/getCartByToken/:token', verifyToken, async (req, res) => {
//   try {
//     const { token } = req.params;
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     const cart = await Cart.findOne({
//       _id: decoded.cardId,
//     })
//       .populate('cartItems.product')
//       .populate('cartItems.addedBy')
//       .populate('cartOwner');
//     if (cart) {
//       return res.status(200).json({
//         data: cart,
//       });
//     }
//     return res.status(404).json({
//       message: 'Cart not found',
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// });

router.get('/', verifyToken, async (request, response) => {
  try {
    const carts = await Cart.findOne({
      cartOwner: request.payload.userId,
    })
      .populate('cartItems.product')
      .populate('cartOwner');

    if (!carts) {
      const newCart = await new Cart({
        cartOwner: request.payload.userId,
        cartItems: [],
      }).save();

      return response.status(404).json({
        data: newCart,
      });
    }

    return response.status(200).json({
      data: carts,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
    });
  }
});

router.get('/:id', async (request, response) => {
  try {
    const cart = await Cart.findOne({
      _id: request.params.id,
    })
      .populate('cartItems.product')
      .populate('cartOwner');
    return response.status(200).json({
      data: cart,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
    });
  }
});

// create token to share cart
// router.get('/share', async (req, res) => {
//   try {
//     const cart = await Cart.findOne({
//       cartOwner: req.query.userId,
//     });
//     if (cart) {
//       cart.isShareable = true;
//       cart.token = Math.random().toString(36).substring(7);
//       await cart.save();
//       return res.status(200).json({
//         cart,
//       });
//     }
//     return res.status(400).json({
//       message: 'Cart not found',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// router.post('/setLimitMoney', verifyToken, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({
//       _id: req.body.cartId,
//     });
//     if (cart) {
//       if (req.body.limitMoney === 0) {
//         cart.limitMoney = null;
//       }

//       cart.limitMoney = req.body.limitMoney;
//       await cart.save();
//       return res.status(200).json({
//         message: 'Limit money set',
//       });
//     }
//     return res.status(400).json({
//       message: 'Cart not found',
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// api delete cart item
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      cartOwner: req.payload.userId,
    });
    if (cart) {
      const product = cart.cartItems.find(
        (item) => item.product.toString() === req.params.id
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

module.exports = router;
