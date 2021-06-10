const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const hbs = require('hbs')
const cookieParser = require("cookie-parser")
require('./config/db')
const {Authenticate, checkUser} = require('./middleware/authMiddleware')
const port = process.env.PORT || 3000

// static root middleware
app.use(express.static('public'))

// set view engine
app.set('view engine', 'hbs')

// use hbs partial file path
hbs.registerPartials('views/partials')

app.use(express.json())
app.use(cookieParser())

// routes
app.get('*', checkUser)
app.get('/', Authenticate, (req, res) => {
    res.render('home')
})

app.use(require('./routes/router'))

// listen server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})