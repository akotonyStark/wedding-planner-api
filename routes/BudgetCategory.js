const auth = require('../middleware/auth')
const BudgetCategory = require('../models/BudgetCategory')
const Couple = require('../models/Couple')

const router = require('express').Router()


router.post('/budget/add-category', auth, async(req,res) => {
    try{
        const author = await Couple.findOne().where('userAccount').equals(req.user._id)
        
        let category = new BudgetCategory({
            ...req.body,
            coupleAccountId: author.userAccount
        })

        if(category){
        await category.save()
        res.status(201).send(category)
        }
        else{
            res.status(400).send('Unable to create category')
        }
    }
    catch(error){
        res.sendStatus(500).send(error)
    }
})


router.get('/budget/category', async(req, res) => {
    try{
        const categories = await BudgetCategory.find({})
        if(categories){
            res.send(categories)
        }
        else{
            res.send('No categories found')
        }
    }
    catch(error){
        res.send(error)
    }
})


router.get('/budget/my-categories', auth, async(req, res) => {
    try{
        const userAccountData = await Couple.findOne().where('userAccount').equals(req.user._id)
        const {userAccount} = userAccountData
       
        const categories = await BudgetCategory.find({})
        if(categories){
            let results = categories.find((item) => item.coupleAccountId == userAccount.toString())
            res.send({payload: results})
        }
        else{
            res.send('No categories found')
        }
    }
    catch(error){
        res.send(error)
    }
})



module.exports = router