const express = require('express')
const Post = require('../models/Post')
const auth = require('../middleware/auth')
const Couple = require('../models/Couple')
const router = express.Router()


router.get('/posts', async(req, res) => {
    const posts = await Post.find({})
    if(!posts){
        return res.status(400).send()
    }
    res.status(200).send(posts)
})

router.get('/my-posts', auth, async(req, res) => {
    // const profile = await Couple.where('userAccount').equals(req.user._id).populate('userAccount')
    // res.send(profile)
    let posts = await Post.find({}).where('author').equals(req.user._id)
    if(!posts){
        return res.status(400).send()
    }
    res.status(200).send(posts)
})

router.post('/post', auth, async(req, res) => {
    try{
        let newPost = new Post({
            ...req.body, 
            author: req.user._id,
            likes: 0,
            views: 0
        })

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