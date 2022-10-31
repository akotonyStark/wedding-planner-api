const mongoose = require('mongoose')
const validator = require('validator')

const vendorSchema = new mongoose.Schema({
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
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
})

const Vendor = mongoose.model('Vendor', vendorSchema)
module.exports = Vendor
