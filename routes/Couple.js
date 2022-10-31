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

module.exports = router
