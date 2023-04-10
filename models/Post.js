const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content: String,
    likes: Number,
    views: Number,
    replies:{
        type: Array
    },
    author:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
}, {timestamps:true})


const Post =  mongoose.model('Post', postSchema)

module.exports = Post