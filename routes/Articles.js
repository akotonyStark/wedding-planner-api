const express = require('express')
const auth = require('../middleware/auth')
const ArticleComment = require('../models/ArticlesModels/ArticlesComment')
const Couple = require('../models/AccountModels/Couple')
const router = express.Router()


router.get('/article/comments', async(req, res) => {
    const comments = await ArticleComment.find({})
    .populate('author')
    .populate([{
        path: 'children',
        populate: {
        path: 'author',
        model:'Couple'
        }}
    ])
    
    if(!comments){
        return res.status(400).send()
    }
    let sorted = comments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.status(200).send(sorted)
})


// await Patient.find({})
//                     .populate([{
//                         path: 'files',
//                         populate: {
//                             path: 'authorizations',
//                             model: 'Authorization'
//                         },
//                         populate: {
//                             path: 'claims',
//                             model: 'Claim',
//                             options: {
//                                 sort: { startDate: 1 }
//                             }
//                         }
//                     }, {
//                         path: 'policies',
//                         model: 'Policy',
//                         populate: {
//                             path: 'vobs',
//                             populate: [{
//                                 path: 'benefits'
//                             }, {
//                                 path: 'eligibility', 
//                                 model: 'Eligibility'
//                             }]
//                         }
//                     }]);

router.get('/article/my-comments', auth, async(req, res) => {
    const author = await Couple.findOne().where('userAccount').equals(req.user._id)
    let myComments = await ArticleComment.find({}).where('author').equals(author._id)
    myComments = myComments.map((values) => {
        return {
            ...values,
            author: author,
        }
    })
   
    if(!myComments){
        return res.status(400).send()
    }
    let sorted = myComments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.status(200).send(sorted)
})

router.post('/article/comment', auth, async(req, res) => {
    try{
        const author = await Couple.findOne().where('userAccount').equals(req.user._id)
        let comment = new ArticleComment({
            ...req.body, 
            author: author
        })

        if(comment){
            await comment.save()
            res.status(201).send(comment)
        }
        else{
            res.status(400).send()
        }
    }catch(error){
        res.status(500).send(error)
    }
   
})


router.delete('/article/comment/:id', async(req, res) => {
    try{
        await ArticleComment.deleteOne({id: req.params.id}).exec()
    }
    catch(error){
        res.status(500).send(error)
    }
})


module.exports = router