const mongoose = require('mongoose')

const article_comment_schema = new mongoose.Schema({
    content:   String,
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Couple'
    },
    userAccount:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    // postId: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'Post'
    // },
    // parent: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'Comment'
    // },
    children: [{
        author: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Couple'
        },
        userAccount:{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        content: String,
        likes: Number,
    }],
    likes: {
        type: Number,
        default: 0
    }
},{timestamps:true})


const ArticleComment = mongoose.model('ArticleComment', article_comment_schema)

module.exports = ArticleComment