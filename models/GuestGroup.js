const mongoose = require('mongoose')


const guest_group_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    numberOfGuests: Number,
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },

}, {timestamps:true})

const GuestGroup = mongoose.model('GuestGroup', guest_group_schema)

module.exports = GuestGroup