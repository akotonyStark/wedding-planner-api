const express = require('express')
const Task = require('../models/Task')
const auth = require('../middleware/auth')
const router = express.Router()

//unprotected task route
router.post('/new-task', async (req, res) => {
  let task = new Task(req.body)

  if (!task) {
    return res.status(400).send()
  }
  await task.save()
  res.status(201).send({ data: task, message: 'Successfully Created' })
})

//protected task route
router.post('/task', auth, async (req, res) => {
  let task = new Task({ ...req.body, author: req.user._id })

  try{
    if (!task) {
      return res.status(400).send()
    }
    await task.save()
    res.status(201).send({ data: task, message: 'Successfully Created' })
  }
  catch(e){
    res.status(500).send(e)
  }
  
})

router.get('/tasks', async (req, res) => {
  let tasks = await Task.find({})
  return res.status(200).send(tasks)
})

module.exports = router
