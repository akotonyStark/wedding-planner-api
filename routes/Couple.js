const express = require('express')
const Couple = require('../models/Couple')
const router = express.Router()

router.post('/couple', async (req, res) => {
  try {
    const couple = new Couple(req.body)
    if (couple) {
      await couple.save()
      res.send(couple)
    } else {
      res.status(404).send({ message: 'Couple could not be created' })
    }
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/couple', async (req, res) => {
  const couplesList = await Couple.find({})
  res.send(couplesList)
})

router.get('/couple/:id', async (req, res) => {
  try {
    const { id } = req.params
    const couple = await Couple.where('userID').equals(id).populate('userID')
    if (couple) {
      res.send(couple)
    } else {
      res.status(404).send({ message: 'No results found' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
