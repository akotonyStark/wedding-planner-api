const express = require('express')
const Task = require('../models/Task')
const auth = require('../middleware/auth')
const Couple = require('../models/Couple')
const router = express.Router()

//unprotected task route
router.post('/new-task', async (req, res) => {
  let task = new Task({...req.body, isComplete: false, dateCompleted: '', assignedTo: ''})

  if (!task) {
    return res.status(400).send()
  }
  await task.save()
  res.status(201).send({ data: task, message: 'Successfully Created' })
})

//protected task route
router.post('/task', auth, async (req, res) => {
  let task = new Task({ ...req.body, author: req.user._id, isComplete: false, dateCompleted: '', assignedTo: '' })

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
  let tasks = await Task.find({}).populate('author')
  let couplesList = await Couple.find({})
  let results = []
  couplesList.forEach((item) => {
    tasks.forEach((task) => {
      if(task.author._id.toString() == item.userAccount.toString()){
        let obj = {
          task_name: task.task_name,
          note: task.note,
          createdAt: task.createdAt,
          isComplete: task.isComplete,
          profileName: item.firstName + ' ' + item.lastName
        }
        results = [...results, obj] 
      }
    })
  })
    
  return res.status(200).send(results)
})


router.get('/my-tasks', auth, async (req, res) => {
  let tasks = await Task.find({}).populate('author')
  let profile = await Couple.where('userAccount').equals(req.user._id)
  let results = []
  tasks.forEach((task) => {
    // console.log(task.author._id.toString(), req.user._id.toString())
    if(task.author._id.toString() == req.user._id.toString()){
      let obj = {
                  id: task._id,
                  author: task.author._id.toString(),
                  task_name: task.task_name,
                  note: task.note,
                  isComplete: task.isComplete || false,
                  task_completed_date: task.task_completed_date || null,
                  assignedTo: task.assignedTo || '',
                  createdAt: task.createdAt,
                  profileName: profile[0].firstName + ' ' + profile[0].lastName
      }
      results.push(obj)
    }
  })
  return res.status(200).send(results)
})





module.exports = router
