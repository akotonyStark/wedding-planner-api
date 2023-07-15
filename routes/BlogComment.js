const express = require('express')
const auth = require('../middleware/auth')
const BlogComment = require('../models/InfluencerBlogComment')
const Couple = require('../models/Couple')
const router = express.Router()


router.get('/comments', async(req, res) => {
    const posts = await BlogComment.find({})
    if(!posts){
        return res.status(400).send()
    }
    let sortedPost = posts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.status(200).send(sortedPost)
})

router.get('/my-comments', auth, async(req, res) => {
    let posts = await BlogComment.find({}).where('author.userAccount').equals(req.user._id)
    if(!posts){
        return res.status(400).send()
    }
    res.status(200).send(posts)
})

router.post('/comment', auth, async(req, res) => {
    try{
        const author = await Couple.findOne().where('userAccount').equals(req.user._id)
        let newPost = new BlogComment({
            ...req.body, 
            author: author,
            isReply: false,
            likes: 0,
            views: 0
        })

       // res.send(newPost)

        if(newPost){
            await newPost.save()
            res.status(201).send(newPost)
        }
        else{
            res.status(400).send()
        }
    }catch(error){
        res.status(500).send(error)
    }
   
})


module.exports = router