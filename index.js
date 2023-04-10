const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/User')
const coupleRouter = require('./routes/Couple')
const taskRouter = require('./routes/Task')
const postRouter = require('./routes/Post')
const app = express()
require('./db/Mongoose')
//allow all origins
app.use(cors())
//express middleware to parse all data to json
app.use(express.json())
app.use(userRouter)
app.use(coupleRouter)
app.use(taskRouter)
app.use(postRouter)

app.get('/', (req, res) => {
  res.send('Welcome to the Wedding Planner API')
})

const PORT = 3000
app.listen('3000', () => {
  console.log(`listening on port ${PORT}`)
})
