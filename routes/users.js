const { verifyToken } = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const router = require('express').Router();

// add post to bookmark
// router.put('/bookmarks/:postId', verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.payload.userId);
//     const postId = req.body.postId;
//     const postIndex = user.bookmarks.indexOf(postId);
//     if (postIndex === -1) {
//       user.bookmarks.push(postId);
//     } else {
//       user.bookmarks.splice(postIndex, 1);
//     }
//     await user.save();
//     res.status(200).json({ data: 'OK' });
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// });

router.get('/bookmarks', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ bookmark: { $in: req.payload.userId } })
      .populate(['author', 'likes', 'commentBy'])
      .populate({
        path: 'comments',
        populate: {
          path: 'commentBy',
        },
      })
      .sort('-createdAt');
    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// get user info by id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
