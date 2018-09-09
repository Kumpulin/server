require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const Knex = require('knex')
const { Model } = require('objection')
const helmet = require('helmet')
const passport = require('passport')
const path = require('path')

const app = express()
const knex = Knex(require('./knexfile'))

Model.knex(knex)
require('./passport')

app.use(helmet())
app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', passport.authenticate('jwt', { session : false }), require('./routes/users'))
app.use('/api/account', passport.authenticate('jwt', { session : false }), require('./routes/account'))
app.use('/api/events', require('./routes/events'))

app.use(function(err, req, res, next) {
  if (Object.keys(err)[0] === 'message') {
    res.status(400).json({ error: err })
  } else {
    console.error(err)
    res.status(500).json({
      error: {
        message: 'An error occured'
      }
    })
  }
})

app.listen(process.env.PORT, () => console.log(`:${process.env.PORT}`))
