const express = require("express");
const Comment = require('../models/Comment');
const User = require('../models/User');

const router = express.Router();


router.get('/:id' ,async(req,res)=>{
    try {
        let comments = await Comment.find({postId:req.params.id})
        .then(res => {

            return Promise.all(
                res.map(async item => {
                    return {
                        content: item.content,
                        authorInfo: await User.findById(item.authorId)
                    }
                })
            )
        })

        res.status(200).json(comments);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error: error });
    }

    // sort({ createdAt: -1 })
})

router.post('/' ,async(req,res)=>{
    
    try {
        const newComment = req.body;
        const comment = new Comment(newComment);
        await comment.save();
        res.status(200).json({ data: comment });
    } catch (error) {
        res.status(500).json({ error: error });
    }
})
router.delete("/:id", async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (comment.postId === req.params.id || req.body.isAdmin) {
      try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  });
module.exports = router;