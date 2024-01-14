const mongoose = require('mongoose')

const comment_schema = new mongoose.Schema({
    content:   String,
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    postId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Post'
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comment'
    },
    children: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comment'
    }],
    likes: Number
},{timestamps:true})


const Comment =  mongoose.model('Comment', comment_schema)
module.exports = Comment