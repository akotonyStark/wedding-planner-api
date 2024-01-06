const express = require('express')
const router = express.Router()

const Guest = require('../models/Guest')


router.get('/guest', async(req, res) => {
    let guestList  = await Guest.find({})
    if(guestList){
        return res.status(200).send({data: guestList})
    }
})


router.post('/guest', async(req, res) => {
    let newGuest = new Guest({...req.body, assigned: false})
    try{
        if(newGuest){
            await newGuest.save()
            res.send({data: newGuest})
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