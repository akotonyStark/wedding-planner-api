const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema(
  {
    task_name: {
      type: String,
      required: true,
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
    dateCompleted: {
      type: Date,
      required: false,
    },
    isComplete: Boolean,
    author:{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    assignedTo: String
  },
  { timestamps: true }
)

const Task = mongoose.model('Task', taskSchema)
module.exports = Task
