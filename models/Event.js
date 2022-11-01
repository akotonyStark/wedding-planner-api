const mongoose = require('mongoose')
const validator = require('validator')

const EventSchema = new mongoose.Schema({
  eventDate: {
    type: Date,
  },
  eventVenue: {
    type: String,
  },
  eventType: String,
  guests: Array,
  seatings: Array,
})

const Event = mongoose.model('Event', EventSchema)

module.exports = Event
