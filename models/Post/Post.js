const mongoose = require('mongoose')

// const postSchema = new mongoose.Schema({
//     subject: String,
//     content: {
//         type: String,
//         required: true
//     },
//     likes: Number,
//     views: Number,
//     replies:{
//         type: Array
//     },
//     author: Object
// }, {timestamps:true})


const post_schema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: Number,
    views: Number,
    comments: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Comment'
        }
    ],
    author:  {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }
},{timestamps:true})

const Post =  mongoose.model('Post', post_schema)
module.exports = Post




// model Post {
//     id        String @id @default(uuid())
//     content   String
//     comments  Comment[]
  
//   }
//   model User {
//     id        String @id @default(uuid())
//     userName  String @unique
//     comments  Comment[]
//     likes Like[]
//   }
  
//   model Comment {
//     id        String    @id @default(uuid())
//     content   String
//     createdAt DateTime  @default(now())
//     updatedAt DateTime  @updatedAt
//     user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
//     userId    String
//     post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
//     postId    String
//     parent    Comment?  @relation("ParentChild", fields: [parentId], references: [id], onDelete: Cascade)
//     children  Comment[] @relation("ParentChild")
//     parentId  String?
//     likes Like[]
  
  
//   }
  
//   model Like {
//     user User @relation(fields: [userId], references: [id], onDelete: Cascade)
//     comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
//     userId String
//     commentId String
//     @@id([userId, commentId])
//   }