const express = require('express')
const Comment = require('../models/ArticlesModels/Comment')
const auth = require('../middleware/auth')
const Couple = require('../models/AccountModels/Couple')
const router = express.Router()


router.get('/comments', async(req, res) => {
    const comments = await Comment.find({})
    if(!comments){
        return res.status(400).send()
    }
    let sortedComments = comments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.status(200).send(sortedComments)
})

router.post('/comment', auth, async(req, res) => {
    try{
        const author = await Couple.findOne().where('userAccount').equals(req.user._id)
 
        let newComment = new Comment({
            ...req.body, 
            author: author,
        })

       // res.send(newPost)

        if(newComment){
            await newComment.save()
            res.status(201).send(newComment)
        }
        else{
            res.status(400).send()
        }
    }catch(error){
        res.status(500).send(error)
    }
   
})


module.exports = router