const express = require('express')
const router = express.Router()

const GuestGroup = require('../models/GuestGroup')


router.get('/guest-group', async(req, res) => {
    let guestListgroups  = await GuestGroup.find({})
    if(guestListgroups){
        return res.status(200).send({data: guestListgroups})
    }
})


router.post('/guest-group', async(req, res) => {
    let newGroup = new GuestGroup(req.body)
    try{
        if(newGroup){
            await newGroup.save()
            res.send({data: newGroup})
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