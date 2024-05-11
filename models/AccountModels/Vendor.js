const mongoose = require('mongoose')
const validator = require('validator')

const vendorSchema = new mongoose.Schema({
  businessAdminName: {
    type: String,
    trim: true,
  },
  businessName: {
    type: String,
    trim: true,
  },
  aboutBusiness: {
    type: String,
    trim: true,
  },
  businessAddress: {
    type: String,
    trim: true,
  },
  businessRegion: {
    type: String,
    trim: true,
  },
  businessCity: {
    type: String,
    trim: true,
  },
  businessEmail: {
    type: String,
    trim: true,
  },
  businessPhone: {
    type: String,
    trim: true,
  },
  businessDays: {
    type: Array,
    trim: true,
  },
  businessStartTime: {
    type: String,
    trim: true,
  },
  businessEndTime: {
    type: String,
    trim: true,
  },
  businessTimeOfDay: {
    type: String,
    trim: true,
  },
  businessVendorCategory: {
    type: String,
    trim: true,
  },
  businessStartingPrice: {
    type: String,
    trim: true,
  },
  numberOfPeople: {
    type: String,
    trim: true,
  },
  businessAccountEmail: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
       validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }
      },
  },
  businessAccountPassword: {
      type: String,
      required: false,
      trim: true,
      // minlength: 7,
      // validate(value) {
      //   if (value.toLowerCase().includes('password')) {
      //     throw new Error('Password cannot contain the word password')
      //   }
      // },
  },
  images: {
    type: Array,
    required: true
  },
  instagram: {
    type: String
  },
  currency: {
    type: String
  }
})

const Vendor = mongoose.model('Vendor', vendorSchema)
module.exports = Vendor

