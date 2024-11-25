const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

const exerciseRoutes = require('./routes/exercises')
const logRoutes = require('./routes/logs')
const userRoutes = require('./routes/users')

const mongoose = require('./mongoose')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.use(exerciseRoutes)
app.use(logRoutes)
app.use(userRoutes)

mongoose.init()
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
