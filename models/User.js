const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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

//ENCRYPT PASSWORD BEFORE SAVING
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(8)
    user.password = await bcrypt.hash(user.password, salt)
  }
  next()
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  console.log(user)
  if (!user) {
    throw new Error('Unable to Login')
  }

  //verify the password
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to Login')
  }
  return user
}

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
