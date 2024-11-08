const mongoose = require('mongoose')
const validator = require('validator')

const coupleSchema = new mongoose.Schema({
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
  weddingDate:{
    type: Date
  },
  partnerName: {
    type: String,
    trim: true,
  },
  partnerEmail: {
    type: String,
    trim: true,
  },
  partnerPhoneNumber: {
    type: String,
    trim: true,
  },
  avatar: String,
  userAccount: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  weddingDetails: {
    type: Object
  }
})

const Couple = mongoose.model('Couple', coupleSchema)
module.exports = Couple
