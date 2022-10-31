const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain the word password')
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

//methods is accessible on the instances of user
userSchema.methods.generateToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'myuniquesecret', {
    expiresIn: '1day',
  })
  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

const User = mongoose.model('User', userSchema)
module.exports = User
