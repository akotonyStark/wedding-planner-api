const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    subject: String,
    content: String,
    likes: Number,
    views: Number,
    replies:{
        type: Array
    },
    author: Object
}, {timestamps:true})


const Post =  mongoose.model('Post', postSchema)

module.exports = Post