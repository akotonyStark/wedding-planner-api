const express = require('express')
const router = express.Router()

const Guest = require('../models/Guest')


router.get('/guest', async(req, res) => {
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


router.post('/guest', async(req, res) => {
    let newGuest = new Guest({...req.body, assigned: false})
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