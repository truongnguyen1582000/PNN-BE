const express = require('express');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();
const Product = require('../models/Products');
const User = require('../models/User');

//GET Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).populate('shopOwner');
    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
    }).populate('shopOwner');
    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// GET my products
router.get('/myProducts', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({
      shopOwner: req.user._id,
    }).populate('shopOwner');
    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

//Create Product
router.post('/', verifyToken, async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.name === '') {
      return res.status(400).json({
        message: 'Name is required',
      });
    }
    if (req.body.description === '') {
      return res.status(400).json({
        message: 'Description is required',
      });
    }
    if (req.body.price === '') {
      return res.status(400).json({
        message: 'Price is required',
      });
    }
    if (req.body.quantity === '') {
      return res.status(400).json({
        message: 'Quantity is required',
      });
    }
    if (req.body.image === '') {
      return res.status(400).json({
        message: 'Image is required',
      });
    }

    const product = await Product.create({
      ...req.body,
      shopOwner: req.payload.userId,
    });
    return res.status(201).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

//Update a Product Information
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
