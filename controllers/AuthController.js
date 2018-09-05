const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const genenrateForgotPasswordToken = require('nanoid')
const User = require('../models/User')

const jwtConfig = require('../config/jwt')
const sendgrid = require('../config/sendgrid')

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

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.query().where({ email: req.body.email })

    if (!user) return next({ message: 'No account with that email address exists.' })

    const token = genenrateForgotPasswordToken().toString()

    await User.query().patch({ resetPasswordToken: token, resetPasswordExpires: require('ms')('1hr').toString() }).where({ email: req.body.email })

    const currentUrl = require('url').format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: req.originalUrl
    })

    const mail = {
      to: req.body.email,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Please reset your password',
      html: `<a href="${currentUrl}?token=${token}">${currentUrl}?token=${token}</a>`,
    }

    await sendgrid.send(mail)

    res.json({})
  } catch (err) {
    return next(err)
  }
}

exports.redirectResetPassword = async (req, res, next) => {
  const user = await User.query().where({ resetPasswordToken: req.query.token }).andWhere('resetPasswordExpires', '>', Date.now())

  if (!user) return next({ message: 'Password reset token is invalid or has expired.' })

  res.redirect(process.env.RESET_PASSWORD_PAGE_URL)
}

exports.resetPassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(req.body.password, salt)

    const updatedUser = await User.query().patch({ password: hash, resetPasswordToken: null, resetPasswordExpires: null }).where({ resetPasswordToken: req.body.token }).first()

    delete updatedUser.password

    res.json({ user: updatedUser })
  } catch (err) {
    next(err)
  }
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
