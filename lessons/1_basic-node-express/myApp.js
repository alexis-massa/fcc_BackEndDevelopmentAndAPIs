let express = require('express');
require('dotenv').config()
let bodyParser = require("body-parser")
let app = express();


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Log middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

// GET index.html
app.get('/', (req, res) => { res.sendFile(`${__dirname}/views/index.html`) })

// Serve /public (static files)
app.use('/public', express.static(`${__dirname}/public`))

// GET /json some JSON data using .env file
app.get('/json', (req, res) => {
  const response = { message: "Hello json" }
  if (process.env.MESSAGE_STYLE === 'uppercase')
    response.message = response.message.toUpperCase()
  res.json(response)
})

// Middleware chain to get req time
app.get('/now',
  (req, res, next) => {
    req.time = new Date().toString()
    next()
  },
  (req, res) => res.json({ time: req.time })
)

// GET to echo a word given as parameter
app.get('/:word/echo', (req, res) => {
  res.json({ echo: req.params.word })
})

// POST to get full name from first and last names
app.route('/name')
  .get((req, res) => { res.json({ name: `${req.query.first} ${req.query.last}` }) })
  .post((req, res) => { res.json({ name: `${req.body.first} ${req.body.last}` }) })


module.exports = app;
