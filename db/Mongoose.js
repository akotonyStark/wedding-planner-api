 const mongoose = require('mongoose')

const connectionURL =
  'mongodb+srv://akotonyStark:Loki2020@cluster0.4n1nv.mongodb.net/WeddingPlanner'

mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log('Successfully connected'))
  .catch((err) => console.log('Error:', err))
