const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

// api get my post
router.get('/my-post', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.payload.userId })
      .populate(['author', 'likes', 'commentBy'])
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
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// get all post
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate(['author', 'likes', 'commentBy'])
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
    console.log('error: ', error);
    res.status(500).json({ error: error });
  }
});

// create post
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log(req.payload);
    const newPost = req.body;
    const post = new Post({
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

//like / dislike a post
router.put('/like/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');

    if (
      !post.likes.some((e) => e.toString() === req.payload.userId.toString())
    ) {
      await post.updateOne({ $push: { likes: req.payload.userId } });
    } else {
      await post.updateOne({ $pull: { likes: req.payload.userId } });
    }
    res.status(200).json();
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post('/:postId/comment', verifyToken, async (req, res) => {
  console.log(req.params.postId);
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
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

// add user to bookmarks
router.put('/bookmark/:postId', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (
      !post.bookmark.some((e) => e.toString() === req.payload.userId.toString())
    ) {
      console.log('run1');

      await post.updateOne({ $push: { bookmark: req.payload.userId } });
    } else {
      console.log('run2');

      await post.updateOne({ $pull: { bookmark: req.payload.userId } });
    }

    res.status(200).json();
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// api delete post
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.deleteOne();
    res.status(200).json({
      message: 'post deleted',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
