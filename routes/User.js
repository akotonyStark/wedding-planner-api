const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')
const Couple = require('../models/Couple')
const router = express.Router()
const multer = require('multer')
const path = require('path')



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },

  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage:storage})

router.post("/upload", upload.single('image'), (req, res) => {
  console.log(req.file)
  res.send("Image uploaded")
})

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
    if(!user){
      return res.status(404).send("Invalid login credentials")
    }
    const token = await user.generateToken()

    res.send({ user, token })
  } catch (e) {
    //console.log(e)
    res.status(400).send()
  }
})

router.post('/auth/logoutAll', auth, async (req, res) => {
  try {
    const user = (req.user)
    user.tokens = []
    await user.save()
    res.send()
   
  } catch (e) {
    //console.log(e)
    res.status(400).send()
  }
})

router.post('/auth/logout', auth, async (req, res) => {
  try {
    const user = (req.user)
    const token = req.header('Authorization').replace('Bearer ', '')
    const tokens = user.tokens.filter((item) => item.token != token)
   // console.log(user)
    user.tokens = tokens
    await user.save()
    res.send()

  } catch (e) {
    //console.log(e)
    res.status(400).send()
  }
})

router.post('/user/create-profile', auth, async (req, res) => {
  try {
    const couple_profile = new Couple({
      ...req.body,
      userAccount: req.user._id,
    })

    if (couple_profile) {
      await couple_profile.save()
      res.status(201).send(couple_profile)
    } else {
      res.status(400).send()
    }
  } catch (error) {
    res.send(error)
  }
})

router.post('/user/image-profile', auth, upload.single('image'), async (req, res) => {
  try {
    //let profile = await Couple.where('userAccount').equals(req.user._id)
    let profile = await Couple.findOne({userAccount: req.user._id})
    profile.avatar = req.file.path
   // console.log(profile)
    await profile.save()
    res.send('Uploaded successfully')
    
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

//update wedding profile
router.post('/user/wedding-profile', auth,  async (req, res) => {
  try {
    //let profile = await Couple.where('userAccount').equals(req.user._id)
    let profile = await Couple.findOne({userAccount: req.user._id})
    if(!profile){
      return res.status(404).send({error: 'Profile not found'})
    }
    profile.weddingDetails = req.body
    profile.weddingDate = req.body.weddingDate
   // console.log(profile)
    await profile.save()
    res.status(200).send({data: profile, message: 'Updated profile successfully'})
    
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

router.get('/user/profile', auth, async (req, res) => {
  try {
    let couple_profile = await Couple.where('userAccount').equals(req.user._id)
    res.send(couple_profile)
  } catch (error) {
    res.send(error)
   
  }
})

module.exports = router
