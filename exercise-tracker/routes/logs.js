const express = require('express')
const User = require('../models/user_model')
const Exercise = require('../models/exercise_model')
const router = express.Router()

router.route('/api/users/:_id/logs')
  // GET /api/users/:_id/logs - Fetch the logs of a user.
  .get(async (req, res) => {
    const { _id } = req.params
    const { from, to, limit } = req.query

    try {
      const user = User.findById(_id)
      if (!user) return res.status(404).json({ error: 'User not found.' })

      let query = { userId: _id }

      if (from || to) {
        query.date = {}
        if (from) query.date.$gte = new Date(from)
        if (to) query.date.$lte = new Date(to)
      }

      const exercises = await Exercise.find(query, '-userId')
        .sort({ date: 1 })
        .limit(limit ? parseInt(limit) : undefined)

      const log = exercises.map(exercise => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      }))

      return res.json({ username: user.username, count: log.length, _id: user._id, log })

    } catch (err) {
      res.status(400).json({ error: 'Failed to fetch logs. Check input data.' });
    }
  })

module.exports = router