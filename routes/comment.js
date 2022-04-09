const express = require('express');
const Comment = require('../models/Comment');
const User = require('../models/User');

const router = express.Router();

router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find();

    res.status(200).json({
      data: comments,
    });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error });
  }
});

router.post('/', async (req, res) => {
  try {
    const newComment = req.body;
    const comment = new Comment(newComment);
    await comment.save();
    res.status(200).json({ data: comment });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// router.delete('/:id', async (req, res) => {
//   const comment = await Comment.findById(req.params.id);
//   if (comment.postId === req.params.id || req.body.isAdmin) {
//     try {
//       await Comment.findByIdAndDelete(req.params.id);
//       res.status(200).json('Account has been deleted');
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json('You can delete only your account!');
//   }
// });
module.exports = router;
