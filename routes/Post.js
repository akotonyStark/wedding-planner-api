const express = require('express')
const Post = require('../models/Post/Post')
const auth = require('../middleware/auth')
const Couple = require('../models/AccountModels/Couple')
const Comment = require('../models/ArticlesModels/Comment')
const router = express.Router()


router.get('/posts', async (req, res) => {
    const posts = await Post.find({})
    if (!posts) {
        return res.status(400).send()
    }
    let sortedPost = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.status(200).send(sortedPost)
})

router.get('/my-posts', auth, async (req, res) => {

    let loggedInUser = req.user._id
    const author = await Couple.findOne().where('userAccount').equals(loggedInUser)
    console.log("author", author)
    let posts = await Post.find({}).where('author').equals(author)
    let mappedPosts = posts.map((item) => {
        return {
            ...item._doc,
            author: {
                avatar: author.avatar,
                fullName: `${author.firstName} ${author.lastName}`
            }
        }
    })
    let comments = await Comment.find({})
    if (!posts) {
        return res.status(400).send()
    }
    res.status(200).send(mappedPosts)
})

router.post('/post', auth, async (req, res) => {
    try {
        const author = await Couple.findOne().where('userAccount').equals(req.user._id)

        let newPost = new Post({
            ...req.body,
            author: author,
            likes: req.body.likes || 0,
            views: req.body.views || 0,
        })

        //res.send(newPost)

        if (newPost) {
            await newPost.save()
            res.status(201).send(newPost)
        }
        else {
            res.status(400).send()
        }
    } catch (error) {
        res.status(500).send(error)
    }

})


module.exports = router