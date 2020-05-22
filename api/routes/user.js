const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const auth = require('../middleware/auth')
const User = require('../models/User')

const router = express.Router()

module.exports = router
