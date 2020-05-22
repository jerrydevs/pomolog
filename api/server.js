const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const connectToDB = require('./config/db')

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')

const app = express()

// Connect to Database
connectToDB()

app.use(cors())
app.use(express.json({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('API is now running...'))

// Define Routes
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`)
})

module.exports = app
