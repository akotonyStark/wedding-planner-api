const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/User')
const coupleRouter = require('./routes/Couple')
const app = express()
require('./db/Mongoose')
//allow all origins
app.use(cors())
//express middleware to parse all data to json
app.use(express.json())
app.use(userRouter)
app.use(coupleRouter)

app.get('/', (req, res) => {
  res.send('Welcome to the Wedding Planner API')
})

app.listen('3001', () => {
  console.log(`listening on port 3001`)
})
