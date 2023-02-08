const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')
const Couple = require('../models/Couple')
const router = express.Router()

router.get('/users', async (req, res) => {
  const users = await User.find({})
  if (users) {
    res.send(users)
  }
})

router.post('/auth/signup', async (req, res) => {
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

router.post('/auth/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateToken()

    res.send({ user, token })
  } catch (e) {
    //console.log(e)
    res.status(400).send()
  }
})

router.post('/user/profile', auth, async (req, res) => {
  try {
    const couple_profile = new Couple({
      ...req.body,
      userAccount: req.user._id,
    })

    if (couple_profile) {
      await couple_profile.save()
      res.status(201).send(couple_profile)
    } else {
      res.status(400)
    }
  } catch (error) {
    res.send(error)
  }
})

router.get('/user/profile', auth, async (req, res) => {
  try {
    let couple_profile = await Couple.where('userAccount').equals(req.user._id)
    // .populate('userAccount')
    // let coupleOBJ = Object.keys(couple_profile)
    // delete coupleOBJ.userAccount.tokens
    // delete coupleOBJ.userAccount.password
    res.send(couple_profile)
  } catch (error) {
    res.send(error)
  }
})

module.exports = router
