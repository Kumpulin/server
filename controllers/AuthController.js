const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const url = require('url')

const jwtConfig = require('../config/jwt')

exports.signUp = (req, res, next) => {
  passport.authenticate('signUp', (err, user) => {
    if (err) return next(err)

    if (Object.keys(user).length === 0) return next({ message: 'Email has been registered' })

    return res.json({ user })
  })(req, res, next)
}

exports.signIn = (req, res, next) => {
  passport.authenticate('signIn', (err, user) => {
    if (err) return next(err)

    if (!user) return next({ message: 'Email or password that you\'ve entered doesn\'t match any account.' })

    req.login(user, { session: false }, err => {
      if (err) return next(err)

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, jwtConfig)

      return res.json({ token })
    })
  })(req, res, next)
}

exports.refreshToken = (req, res, next) => {
  const token = req.headers['authorization'].split('Bearer ')[1]

  const user = jwt.verify(token, process.env.JWT_SECRET, jwtConfig)

  if (user.iat > user.exp) return next({ message: 'Token has been expired.' })

  delete user.iat
  delete user.exp

  const newToken = jwt.sign({ ...user, exp: user.exp - Date.now() / 1000 }, process.env.JWT_SECRET)
  return res.json({ token: newToken })
}

exports.OAuthCallback = (req, res) => {
  const user = {
    id: req.user.id,
    email: req.user.email
  }

  const token = jwt.sign({ ...user }, process.env.JWT_SECRET, jwtConfig)

  res.json({ token })
}
