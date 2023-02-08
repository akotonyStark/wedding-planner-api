const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema(
  {
    task_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    note: {
      type: String,
      required: false,
      trim: true,
    },
    ceremony_type: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    task_date: {
      type: Date,
      required: true,
    },
    author:{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

const Task = mongoose.model('Task', taskSchema)
module.exports = Task
