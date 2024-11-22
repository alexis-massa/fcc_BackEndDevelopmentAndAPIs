require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const shortenedUrlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, default: 0 }
})

const ShortenedUrl = mongoose.model("ShortenedUrl", shortenedUrlSchema)

// Basic Configuration
const port = process.env.PORT || 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/public', express.static(`${process.cwd()}/public`))

/**
 * Validates a URL string using regex and DNS checks.
 * @param {string} urlString - The URL to validate.
 * @returns {Promise<boolean>} - Returns true if the URL is valid and DNS resolves, false otherwise.
 */
const isUrlValid = async (urlString) => {
  // Check if the URL matches the regex
  const urlRegex = /^https?:\/\/([\w-]+\.)*[\w-]+(:\d+)?(\/[^\s]*)?$/i
  if (!urlRegex.test(urlString)) return false

  const hostname = new URL(urlString).hostname

  // Allow localhost without DNS resolution
  if (hostname === 'localhost') return true

  // Check DNS resolution for the hostname
  try {
    await dns.promises.lookup(hostname)
    return true
  } catch { return false }
}


app.get('/', function (req, res) { res.sendFile(process.cwd() + '/views/index.html') })

/**
 * POST /api/shorturl
 * 
 * Creates or retrieves a shortened URL for a given original URL.
 * 
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.url - The URL to be shortened.
 * @param {Object} res - The response object.
 * @returns {Object} - A JSON response with either the existing or newly created shortened URL.
 * @throws {Error} - Returns a JSON error response if the URL is invalid or an internal error occurs.
 * 
 * @example
 * // Request body
 * {
 *   "url": "https://www.example.com"
 * }
 * 
 * // Response
 * {
 *   "original_url": "https://www.example.com",
 *   "short_url": 1
 * }
 */
app.post('/api/shorturl', async (req, res) => {
  const original_url = req.body.url

  // Validate URL
  const urlIsValid = await isUrlValid(original_url)
  if (!urlIsValid) return res.json({ error: 'invalid url' })

  // If shortnered url already exists
  ShortenedUrl.findOne({ original_url: original_url }, (err, existing_shortened_url) => {
    if (err) return console.error(err)
    // return existing short url
    if (existing_shortened_url) return res.json(existing_shortened_url)

    // Find the highest current short_url and increment it
    ShortenedUrl.findOne().sort({ short_url: -1 }).exec((err, lastUrl) => {
      if (err) return console.error(err)
      const newShortUrl = lastUrl ? lastUrl.short_url + 1 : 1 // If no URLs exist, start from 1
      new ShortenedUrl({ original_url: original_url, short_url: newShortUrl }).save(
        (err, new_shortened_url) => {
          if (err) return console.error(err)
          return res.json(new_shortened_url)
        }
      )
    })
  })
})

/**
 * GET /api/shorturl/:shorturl
 * 
 * Redirects to the original URL associated with the provided short URL.
 * 
 * @function
 * @param {Object} req - The request object.
 * @param {Object} req.params - The URL parameters.
 * @param {string} req.params.shorturl - The short URL identifier.
 * @param {Object} res - The response object.
 * @returns {void} - Redirects to the original URL or returns a JSON error response if the short URL is not found.
 * @throws {Error} - Logs an internal error to the console if a database operation fails.
 * 
 * @example
 * // Request
 * GET /api/shorturl/1
 * 
 * // Redirects to
 * https://www.example.com
 * 
 * // Or response if not found
 * {
 *   "error": "No short URL found for this code"
 * }
 */
app.get('/api/shorturl/:shorturl', (req, res) => {
  if (!req.params.shorturl || req.params.shorturl == 'undefined') return res.json({ error: "Invalid shorturl" })
  ShortenedUrl.findOne({ short_url: req.params.shorturl }, (err, shortened_url) => {
    if (err) return console.error(err)
    // If the short_url exists, redirect to the original_url
    if (shortened_url) return res.redirect(shortened_url.original_url)
    // If the short_url doesn't exist
    else return res.json({ error: 'No short URL found for this code' })
  })
})


app.listen(port, function () { console.log(`Listening on port ${port}`) })
