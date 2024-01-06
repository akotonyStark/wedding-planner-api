const mongoose = require('mongoose')


const guest_group_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    numberOfGuests: Number

}, {timestamps:true})

const GuestGroup = mongoose.model('GuestGroup', guest_group_schema)

module.exports = GuestGroup