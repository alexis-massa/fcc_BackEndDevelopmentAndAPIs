// index.js
// where your node app starts

// init project
require('dotenv').config()
var express = require('express')
var app = express()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors')
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

/**
 * GET /api/whoami
 * Returns a JSON object with the user's IP address, preferred language, and software information.
 *
 * @returns {Object} JSON response containing:
 *   - `ipaddress` {string}: The user's IP address.
 *   - `language` {string}: The preferred language from the `Accept-Language` header.
 *   - `software` {string}: Details about the user's operating system and browser from the `User-Agent` header.
 *
 * @example
 * // Sample Request
 * GET /api/whoami
 *
 * // Sample Response
 * {
 *   "ipaddress": "123.45.67.89",
 *   "language": "en-US,en;q=0.9",
 *   "software": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
 * }
 */
app.get('/api/whoami', (req, res) => {
  const ipaddress = req.ip
  const language = req.headers['accept-language']
  const software = req.headers['user-agent']

  res.json({ ipaddress, language, software })
})


// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
