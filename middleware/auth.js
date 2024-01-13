const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Couple = require('../models/Couple')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')

    const decoded = jwt.verify(token, 'myuniquesecret')
    // console.log(decoded)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    //const user = await User.findOne({ _id: decoded._id})

    const profile = await Couple.findOne({ _id: user._id })

    if (!user) {
      res.status(401).send({ error: 'Unauthorized' })
    }

    req.token =  token
    req.user = user
    req.profile = profile
    next()
  } catch (e) {
    console.log(e)
    res.status(401).send({ error: 'Unauthorized' })
  }
}


module.exports = auth
