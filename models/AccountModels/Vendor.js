const mongoose = require('mongoose')
const validator = require('validator')

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
  },
})

const Vendor = mongoose.model('Vendor', vendorSchema)
module.exports = Vendor
