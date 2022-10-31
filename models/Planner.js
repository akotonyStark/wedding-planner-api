const mongoose = require('mongoose')
const validator = require('validator')

const PlannerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  region: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  ratings: { type: Number },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
})

const Planner = mongoose.model('Planner', PlannerSchema)
module.exports = Planner
