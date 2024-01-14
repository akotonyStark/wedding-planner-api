const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    blogTitle: String,
    blogId:String,
    content: {
        type: String,
        required: true
    },
    likes: Number,
    views: Number,
    comments:{
        type: Array
    },
    author: Object,
    isReply: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps:true})


const BlogComment =  mongoose.model('BlogComment', postSchema)

module.exports = BlogComment