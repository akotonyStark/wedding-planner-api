const express = require('express')
const Vendor = require('../models/AccountModels/Vendor')
const router = express.Router()




router.get('/vendors', async (req, res) => {
    //getting data and removing one password property
    const vendors = await Vendor.find().select(['-businessAccountPassword'])
    try {
        if (!vendors) {
            return res.status(400).send('There are no vendors available yet')
        }

        res.status(200).send({ payload: vendors })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/vendor', async (req, res) => {
    const vendor = new Vendor(req.body)
    try {
        if (!vendor) {
            return res.status(400).send('Error creating vendor account')
        }
        await vendor.save()
        res.status(201).send({ payload: vendor })
    } catch (error) {
        res.status(500).send(error)
    }

})


module.exports = router