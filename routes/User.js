const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/AccountModels/User')
const Couple = require('../models/AccountModels/Couple')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { sendWelcomeEmail, sendInvitation, sendPasswordResetEmail, sendCompletePasswordResetEmail } = require('../emails/user_account')
const jwt = require('jsonwebtoken')



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },

  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

router.post("/upload", upload.single('image'), (req, res) => {
  //console.log(req.file)
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

    if (!user) {
      return res.status(404).send("Invalid login credentials")
    }
    const token = await user.generateToken()

    res.send({ user, token })
  } catch (e) {
    console.log(e)
    return res.status(500).send({error: "Invalid login credentials"})
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
      //send welcome and Partner invitation email
      sendWelcomeEmail(req.user.email, req.body.firstName)
      sendInvitation(req.body.partnerEmail, req.body.partnerName, req.body.firstName)
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
    let profile = await Couple.findOne({ userAccount: req.user._id })
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
router.post('/user/wedding-profile', auth, async (req, res) => {
  try {
    //let profile = await Couple.where('userAccount').equals(req.user._id)
    let profile = await Couple.findOne({ userAccount: req.user._id })
    if (!profile) {
      return res.status(404).send({ error: 'Profile not found' })
    }
    profile.weddingDetails = req.body
    profile.weddingDate = req.body.weddingDate
    // console.log(profile)
    await profile.save()
    res.status(200).send({ data: profile, message: 'Updated profile successfully' })

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

router.get('/user/profile', auth, async (req, res) => {
  try {
    let couple_profile = await Couple.where('userAccount').equals(req.user._id).populate('userAccount')
    let user = Object.assign(couple_profile[0], {})
    delete user.userAccount.password
    delete user.userAccount.tokens

    res.send(user)
  } catch (error) {
    res.send(error)

  }
})


router.post('/user/update-account', auth, async (req, res) => {
  let payload = {
    ...req.body, ...req.user
  }

  try {
    //const user = await User.findOne({ _id: req.user._id })
    const filter = { _id: req.user._id };
    const user = await User.findOne(filter);

    if (user) {
      if (payload.password !== '' || payload.email !== '') {
        await User.updateOne(filter, { password: payload.password, email: payload.email });
        user.password = payload.password
        user.email = payload.email
        await user.save()
        sendPasswordResetEmail(payload.email, payload.firstName)
      }
      let profile = await Couple.findOne({ userAccount: req.user._id })

      if (profile) {
        const updates = Object.keys(req.body)
        updates.forEach((update) => {
          profile[update] = req.body[update]
        })
        await profile.save()
        res.status(200).send({ payload: profile })

      }
      else {
        res.send('No couple account found')
      }


    }
    else {
      res.status(401).send('User Not found')
    }
  } catch (error) {
    res.send(error)
  }
})

router.post('/user/send-invitation', auth, async (req, res) => {
  const {partnerEmail, partnerName} = req.body

  try {
    //const user = await User.findOne({ _id: req.user._id })
    const filter = { _id: req.user._id };
    const user = await User.findOne(filter);

    if(user){
      const sender = `${user.firstName} ${user.lastName}`
      sendInvitation(partnerEmail,partnerName, sender )
      return res.status(200).send('Invitation Sent')
    }
    else{
      res.status(401).send('Unauthorized')
    }
  
  } catch (error) {
    res.send(error)
  }
})


router.post('/send-reset-link', async(req, res) => {

  try{
    const user = await User.findOne({email: req.body.email})
    console.log("Found user:", user)
    if(user){
      const token = jwt.sign({ _id: user._id.toString() }, 'myuniquesecret', {
        expiresIn: '1day',
      })
      sendCompletePasswordResetEmail(req.body.email, token)
      res.send('Login to your email to reset password')
      //res.send(`complete-password-reset?token=${token}`)
    }
    else{
      res.status(400).send('This user account does not exist')
    }
  }
  catch(error){
    console.log(error)
    res.status(500).send(error)
  }

})

router.post('/reset-password', async(req, res) => {
  try{
    const token = req.body.token
    const data = jwt.decode(token)
    const id = data._id
    if(id){
      const user = await User.findOne({_id: id})
      user.password = req.body.password
      await user.save()
      return res.send("Password reset completed")
    }
    else{
      return res.status(401).send("Unauthorized access")
    }
    
  }
  catch(e){
    res.send(500)
  }
  
})

module.exports = router
