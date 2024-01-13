const express = require('express')
const router = express.Router()

const Guest = require('../models/Guest')
const auth = require('../middleware/auth')


// Comment this out in Production
router.get('/guest-all', async(req, res) => {
    let guestList  = await Guest.find({}).populate('group')

    const {name} = req.query; 

    if(name){
       
        const filteredUsers = guestList.filter((guest) => guest.name.toLowerCase().includes(name.toLowerCase()))
        return res.status(200).send({payload: filteredUsers}) 
    }
   

    if(guestList){
        return res.status(200).send({payload: guestList})
    }
})


router.get('/guest', auth, async(req, res) => {
    let loggedInUser = req.user?._id
 
    let guestList  = await Guest.find({userId: loggedInUser}).populate('group')

    const {name} = req.query; 

    if(name){
       
        const filteredUsers = guestList.filter((guest) => guest.name.toLowerCase().includes(name.toLowerCase()))
        return res.status(200).send({payload: filteredUsers}) 
    }
   

    if(guestList){
        return res.status(200).send({payload: guestList})
    }
})
    


router.post('/guest', auth, async(req, res) => {
    const userId = req.user._id
    let newGuest = new Guest({
        ...req.body,
         userId: userId,
         assigned: false
        })
    //res.send(newGuest)
    try{
        if(newGuest){
            await newGuest.save()
            res.status(201).send({payload: newGuest})
        }
        else{
            res.status(400).send()
        }
    }
    catch(err){
        res.status(500).send(err)
    }
   
})




module.exports = router