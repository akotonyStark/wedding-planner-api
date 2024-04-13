const express = require('express')
const Vendor = require('../models/AccountModels/Vendor')
const multer = require('multer')
const path = require('path')
const router = express.Router()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/vendors/')
    },
  
    filename: (req, file, cb) => {
      //console.log(file)
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })

const upload = multer({ storage: storage })

router.get('/vendors', async (req, res) => {
    //getting data and removing one password property
    const vendors = await Vendor.find().select(['-businessAccountPassword'])
    const {name} = req.query; 
    try {
        if (!vendors) {
            return res.status(400).send('There are no vendors available yet')
        }


        if(name){       
            const filtered = vendors.filter((item) => item.businessName.toLowerCase().includes(name.toLowerCase()))
            return res.status(200).send({payload: filtered}) 
        }
        else{
            res.status(200).send({ payload: vendors })
        }
       
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get('/vendor/:id', async (req, res) => {
    //getting data and removing one password property
    const {id} = req.params
   
    const vendor = await Vendor.findById({_id: id}).select(['-businessAccountPassword'])
    try {
        if (!vendor) {
            return res.status(400).send('This vendor does not exist')
        }
        else{  
            res.status(200).send({ payload: vendor })
            
        }
       
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/vendor',  upload.array('imageFiles'), async (req, res) => {
    const vendor = new Vendor(req.body)
    vendor.images = []
    try {
        if (!vendor) {
            return res.status(400).send('Error creating vendor account')
        }
        for(let i=0; i<req.files.length; i++){
            vendor.images.push(req.files[i].path)
        }
        await vendor.save()
        res.status(201).send({ payload: vendor })
    } catch (error) {
        res.status(500).send(error)
    }

})


module.exports = router


