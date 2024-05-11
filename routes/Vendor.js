const express = require('express')
const Vendor = require('../models/AccountModels/Vendor')
const multer = require('multer')
const path = require('path')
const User = require('../models/AccountModels/User')
const auth = require('../middleware/auth')
const Couple = require('../models/AccountModels/Couple')
const VendorReview = require('../models/ReviewModels/VendorReview')
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
    let images = []
    try {
        if (!vendor) {
            return res.status(400).send('Error creating vendor account')
        }
        for(let i=0; i<req.files.length; i++){
            images.push(req.files[i].path)
        }
        //remove duplicate images
        let uniqueImagesArr = [...new Set(images)]
        vendor.images = uniqueImagesArr
        await vendor.save()
        res.status(201).send({ payload: vendor })
    } catch (error) {
        res.status(500).send(error)
    }

})


router.post('/vendor/review', auth, async(req, res) => {

    try{
        let account = await User.findOne({_id: req.user._id}).select(['-password', '-tokens'])
        let reviewer = await Couple.findOne({userAccount: account._id})

        if(!reviewer){
            return res.send("Please login to leave a review")
        }
        let review = new VendorReview({
            review: req.body.review,
            vendor: req.body.vendor,
            reviewer: reviewer?._id,
            reviewerName: reviewer?.firstName + ' ' +reviewer?.lastName,
            avatar: reviewer?.avatar,
        })

        await review.save()
        res.status(201).send({payload: review})
        
    }
    catch(error){
        res.send({error})
    }
    

})


router.get('/vendor/reviews/:id', async(req, res) => {
    let id = req.params.id
    let reviews = await VendorReview.find({vendor: id})
    res.send({payload: reviews})
})


module.exports = router


