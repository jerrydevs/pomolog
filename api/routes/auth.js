const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const { check, validationResult } = require('express-validator')

const auth = require('../middleware/auth')
const User = require('../models/User')

const router = express.Router()

// @route   GET api/auth
// @desc    Get user information
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public
// Body:    JSON { email: '', password: '' }
router.post(
  '/',
  [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Password is rquired').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() })
    }

    const { email, password } = req.body

    try {
      // Check if user exists
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' })
      }

      // Check if password is correct
      const isCorrectPassword = await bcrypt.compare(password, user.password)
      if (!isCorrectPassword) {
        return res.status(400).json({ msg: 'Invalid Credentials' })
      }

      const userData = {
        user: {
          id: user.id,
        },
      }

      // Get jwt token, expires in 1hr
      const tokenSecret = config.has('tokenSecret')
        ? config.get('tokenSecret')
        : 'mytemporarysecret'

      jwt.sign(userData, tokenSecret, { expiresIn: 1000000 }, (err, token) => {
        if (err) throw err
        res.json({ token })
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  },
)

module.exports = router
