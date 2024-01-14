const express = require('express')
const Task = require('../models/TaskModels/Task')
const auth = require('../middleware/auth')
const Couple = require('../models/AccountModels/Couple')
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
          id: task._id,
          author: task.author._id.toString(),
          task_name: task.task_name,
          note: task.note,
          isComplete: task.isComplete || false,
          expectedCompletionDate: task.expectedCompletionDate,
          category: task.category,
          ceremony_type: task.ceremony_type,
          task_completed_date: task.task_completed_date || null,
          assignedTo: task.assignedTo || '',
          createdAt: task.createdAt,
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
                  _id: task._id,
                  author: task.author._id.toString(),
                  task_name: task.task_name,
                  note: task.note,
                  isComplete: task.isComplete || false,
                  expectedCompletionDate: new Date(task.expectedCompletionDate).toISOString().substring(0,10),
                  category: task.category,
                  ceremony_type: task.ceremony_type,
                  task_completed_date: task.task_completed_date|| null,
                  assignedTo: task.assignedTo || '',
                  createdAt: task.createdAt,
                  profileName: profile[0].firstName + ' ' + profile[0].lastName
      }
      results.push(obj)
    }
  })
  let noCompleted = results.filter((task) => task.isComplete == true).length
  let percentageCompleted = (noCompleted/results.length) * 100
  return res.status(200).send({tasks: results, percentageCompleted})
})

router.get('/task/:id', auth, async (req, res) => {
  let id = req.params.id
  let task = await Task.find({_id: id})

  try{
    if (!task) {
      return res.status(400).send()
    }
    res.status(200).send({ data: task, message: 'Record Found' })
  }
  catch(e){
    res.status(500).send(e)
  }
  
})

router.put('/task/mark-as-complete/:id', auth, async (req, res) => {
  let id = req.params.id
  let task = await Task.findOne({_id: id})

  try{
    if (!task) {
      return res.status(400).send()
    }
    task.isComplete = !task.isComplete
    task.dateCompleted = new Date().toISOString().substring(0,10)
    await task.save()
    let updatedList = await Task.where('author').equals(req.user._id)
    let noCompleted = updatedList.filter((task) => task.isComplete == true).length
    let percentageCompleted = (noCompleted/updatedList.length) * 100
    return res.status(201).send({tasks: updatedList, percentageCompleted})
    //res.status(201).send({ data: updatedList, message: 'Updated' })
  }
  catch(e){
    console.log(e)
    res.status(500).send(e)
  }
  
})

router.put('/task/:id', auth, async (req, res) => {
  let id = req.params.id
  let payload = req.body
  let task = await Task.findOneAndUpdate({_id: id}, payload)
  try{
    if (!task) {
      return res.status(400).send()
    }
    let updatedList = await Task.where('author').equals(req.user._id)
    return res.status(201).send({tasks: updatedList, message: 'Updated'})
  }
  catch(e){
    console.log(e)
    res.status(500).send(e)
  }
  
})


router.delete('/task/:id', auth, async (req, res) => {
  let id = req.params.id
  let task = await Task.deleteOne({_id: id})
  let copy = task
  try{
    if (!task) {
      return res.status(400).send()
    }
    res.status(201).send({ data: copy, message: 'Deleted' })
  }
  catch(e){
    console.log(e)
    res.status(500).send(e)
  }
  
})





module.exports = router
