const express = require("express");
const Task = require("../models/TaskModels/Task");
const Guest = require("../models/GuestModels/Guest");
const auth = require("../middleware/auth");
const Couple = require("../models/AccountModels/Couple");

const router = express.Router()

router.get('/dashboard-data', auth, async(req,res) => {
    const user = req.user
    const coupleAccount = await Couple.findOne({userAccount: user._id})
    const todoList = await Task.find({author: user._id})
    const guestList = await Guest.find({userId: user._id})

    let payload = {
        todoListData: {
            //tasks: todoList,
            total: todoList.length,
            completed: todoList.filter((item) => item.isComplete).length,
            percentage: function(){
                return (this.completed / this.total) * 100 || 0
            }, 
        },
        budgetData: {
            spentBudget: Number(coupleAccount?.weddingDetails?.amountSpent) || 0,
            estimatedBudget: Number(coupleAccount?.weddingDetails?.budget) || 0,
            percentage: function(){
                return (this.spentBudget / this.estimatedBudget) * 100 || 0
            }, 
        },
        vendorsData: {},
        guestListData: {
            estimated: coupleAccount?.weddingDetails?.guestSize.includes('-') ? Number(coupleAccount?.weddingDetails?.guestSize.split('-')[1]) : Number(coupleAccount?.weddingDetails?.guestSize),
            totalGuests: guestList.length || 0,
            percentage: function(){
                return (this.totalGuests / this.estimated) * 100 || 0
            }, 
        },
        seatingsData: {}
    }

    payload.todoListData.percentageCompleted = payload.todoListData.percentage().toFixed(1)
    payload.guestListData.percentageCompleted = payload.guestListData.percentage().toFixed(1)
    payload.budgetData.percentageCompleted = payload.budgetData.percentage().toFixed(1) 
    payload.overallPercentage = ((Number(payload.todoListData.percentageCompleted) +  Number(payload.guestListData.percentageCompleted) + Number(payload.budgetData.percentageCompleted))/3).toFixed(1)  || 0

    
    res.send({payload: payload})
})

module.exports = router