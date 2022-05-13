const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.js');
const Address = require('../models/Address');

// api create address for user
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { info } = req.body;
    if (info.name === '') {
      return res.status(400).json({
        message: 'Name is required',
      });
    } else if (info.phone === '') {
      return res.status(400).json({
        message: 'Phone is required',
      });
    } else if (info.address === '') {
      return res.status(400).json({
        message: 'Address is required',
      });
    }
    const userId = req.payload.userId;

    const address = await Address.findOne({ author: userId });

    // if user already exist, push address to addressList
    if (address) {
      address.addressList.push(info);
      await address.save();
    } else {
      // if user not exist, create new address
      const newAddress = new Address({
        author: userId,
        addressList: [info],
      });
      await newAddress.save();
    }
    res.status(200).json({
      message: 'Create address successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// api get all address for user
router.get('/getAll', verifyToken, async (req, res) => {
  try {
    const userId = req.payload.userId;
    const address = await Address.findOne({ author: userId }).populate(
      'author'
    );

    res.status(200).json({
      message: 'Get all address successfully',
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// api delete address for user
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.payload.userId;
    const address = await Address.findOne({ author: userId });
    const index = address.addressList.findIndex(
      (item) => item._id.toString() === req.params.id
    );
    if (index === -1) {
      return res.status(400).json({
        message: 'Address not found',
      });
    }
    address.addressList.splice(index, 1);
    await address.save();
    res.status(200).json({
      message: 'Delete address successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
