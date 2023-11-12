const { Schema, mongoose } = require("mongoose");

const BudgetCategorySchema = new mongoose.Schema({
    categoryName:  {
        type: String,
        required: true,
    },
    budget:  {
        type: Number,
        required: true,
    },
    coupleAccountId:  {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Couple'
    }
})


let BudgetCategory = new mongoose.model('BudgetCategory', BudgetCategorySchema)

module.exports = BudgetCategory