const mongoose = require('mongoose')

const blog_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    published: {
        type: Boolean,
        default: false
    },
    author: String,
    content: String,
    tags: [String],
    comments: [{
        user: String,
        content: String,
        votes: Number
    }]
}, {timestamps:true})


const Blog = new mongoose.model('Blog', blog_schema)
export default Blog