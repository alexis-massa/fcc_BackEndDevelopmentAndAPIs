// index.js
// where your node app starts

// init project
var express = require('express')
var app = express()
require('dotenv').config()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors')
app.use(cors({ optionsSuccessStatus: 200 }))  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) { res.sendFile(__dirname + '/views/index.html') })


/**
 * GET /api/:date?
 * Converts a date input (Unix or UTC) into JSON with Unix timestamp and UTC string.
 * If no date is provided, returns the current timestamp.
 *
 * @param {string} [date] - Optional date parameter (Unix timestamp or valid date string).
 * @returns {Object} JSON with `unix` and `utc` keys or an error message.
 * @example GET /api/1451001600000 => { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }
 * @example GET /api/invalid-date => { error: "Invalid Date" }
 * @example GET /api/ => { unix: 1639872000000, utc: "Tue, 19 Nov 2024 00:00:00 GMT" }
 */
app.get('/api/:date?', (req, res) => {
  const dateParam = req.params.date

  // Parse the date (use current date if no parameter provided)
  const date = dateParam ? (isNaN(dateParam) ? new Date(dateParam) : new Date(parseInt(dateParam))) : new Date()

  // Validate the date and respond accordingly
  if (isNaN(date.getTime())) return res.json({ error: "Invalid Date" })
  res.json({ unix: date.getTime(), utc: date.toUTCString() })
})


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
