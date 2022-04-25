const express = require('express');
const Rescue = require('../models/Rescue');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// get all post
router.get('/', async (req, res) => {
  try {
    const posts = await Rescue.find()
      .populate(['author', 'commentBy'])
      .populate({
        path: 'comments',
        populate: {
          path: 'commentBy',
        },
      })
      .sort('-createdAt');
    res.status(200).json({
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// create post
router.post('/', verifyToken, async (req, res) => {
  try {
    const newPost = req.body;
    const post = new Rescue({
      ...newPost,
      author: req.payload.userId,
      likeCount: [],
    });
    await post.save();
    res.status(200).json({ data: post });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post('/:postId/comment', verifyToken, async (req, res) => {
  console.log(req.params.postId);
  try {
    await Rescue.findByIdAndUpdate(req.params.postId, {
      $push: {
        comments: {
          commentBy: req.payload.userId,
          content: req.body.content,
        },
      },
    });

    res.status(200).json({});
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// api set status to false
router.put('/:id', async (req, res) => {
  try {
    const rescue = await Rescue.findById(req.params.id);
    if (!rescue) {
      return res.status(404).json({
        message: 'Rescue not found',
      });
    }
    rescue.status = false;
    await rescue.save();
    res.status(200).json({
      message: 'OK',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
