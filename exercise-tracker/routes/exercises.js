const express = require('express')
const router = express.Router()

const User = require('../models/user_model')
const Exercise = require('../models/exercise_model')

router.route('/api/users/:_id/exercises')
  // POST /api/users/:_id/exercises - Add an exercise to a user
  .post(async (req, res) => {
    const { _id } = req.params
    const { description, duration, date } = req.body

    try {
      const user = await User.findById(_id)
      if (!user) return res.status(404).json({ error: 'User not found.' })

      const exerciseDate = date ? new Date(date) : new Date()
      const newExercise = await Exercise.create({
        userId: _id,
        description,
        duration: parseInt(duration),
        date: exerciseDate
      })

      return res.json({
        _id: user._id,
        username: user.username,
        description: newExercise.description,
        duration: newExercise.duration,
        date: exerciseDate.toDateString()
      })

    } catch (err) {
      return res.status(400).json({ error: 'Failed to add exercise. Check input data.' })
    }
  })

module.exports = router