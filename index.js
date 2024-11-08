const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
const userRouter = require('./routes/User')
const coupleRouter = require('./routes/Couple')
const taskRouter = require('./routes/Task')
const postRouter = require('./routes/Post')
const commentsRouter = require('./routes/BlogComment')
const articlesRouter = require('./routes/Articles')
const budgetRouter = require('./routes/BudgetCategory')
const guestRouter = require('./routes/Guest')
const guestGroupRouter = require('./routes/GuestGroup')
const dashboardRouter = require('./routes/Dashboard')
const vendorsRouter = require('./routes/Vendor')

require("dotenv").config();


const app = express()
require('./db/Mongoose')
//allow all origins
app.use(cors())
//express middleware to parse all data to json

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(userRouter)
app.use(coupleRouter)
app.use(taskRouter)
app.use(postRouter)
app.use(budgetRouter)
// app.use(commentsRouter)
app.use(guestRouter)
app.use(guestGroupRouter)

app.use(articlesRouter)
app.use(dashboardRouter)
app.use(vendorsRouter)



app.get('/', (req, res) => {
  res.send('Welcome to the Xperience Bliss API')
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`listening to API on port ${PORT}`)
})


