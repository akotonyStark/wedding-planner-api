const express = require('express')
const router = express.Router()

const GuestGroup = require('../models/GuestModels/GuestGroup')
const auth = require('../middleware/auth')

router.get('/guest-group/all', async(req, res) => {
   
    let guestListgroups  = await GuestGroup.find({})
    
    const {name} = req.query; 

    if(name){
       
        const filtered = guestListgroups.filter((guest) => guest.name.toLowerCase().includes(name.toLowerCase()))
        return res.status(200).send({payload: filtered}) 
    }

    if(guestListgroups){
        return res.status(200).send({payload: guestListgroups})
    }
})

router.get('/guest-group', auth, async(req, res) => {
    let loggedInUser = req.user?._id
    let guestListgroups  = await GuestGroup.find({userId: loggedInUser})
    
    const {name} = req.query; 

    if(name){
       
        const filtered = guestListgroups.filter((guest) => guest.name.toLowerCase().includes(name.toLowerCase()))
        return res.status(200).send({payload: filtered}) 
    }

    if(guestListgroups){
        return res.status(200).send({payload: guestListgroups})
    }
})


router.post('/guest-group', auth, async(req, res) => {
    let loggedInUser = req.user?._id
    let newGroup = new GuestGroup({
        ...req.body,
        userId: loggedInUser
    })
    //res.send(newGroup)
    try{
        if(newGroup){
            await newGroup.save()
            res.send({payload: newGroup})
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