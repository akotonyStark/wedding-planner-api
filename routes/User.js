const express = require('express')
const User = require('../models/User')
const router = express.Router()

router.get('/users', async (req, res) => {
  const users = await User.find({})
  if (users) {
    res.send(users)
  }
})

router.post('/user', async (req, res) => {
  try {
    const user = new User(req.body)
    if (user) {
      const token = await user.generateToken()
      await user.save()
      res.status(201).send(user)
    } else {
      res.status(400)
    }
  } catch (error) {
    res.send(error)
  }
})

module.exports = router
