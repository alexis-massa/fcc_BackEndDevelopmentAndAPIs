const express = require('express')
const router = express.Router()
const User = require('../models/user_model')

router.route('/api/users')
  // POST /api/users - Create new user
  .post(async (req, res) => {
    const { username } = req.body
    try {
      const newUser = await User.create({ username })
      return res.json(newUser)
    } catch (err) {
      return res.status(400).json({ error: 'Username is invlid or already exists.' })
    }
  })
  // GET /api/users - Get all users
  .get(async (req, res) => {
    try {
      const users = await User.find({}, 'username _id')
      return res.json(users)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch users.' })
    }
  })

module.exports = router