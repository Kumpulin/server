const User = require('../models/User')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')
const bcrypt = require('bcrypt')

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.query().findById(req.user.id)

    delete user.password

    res.json({ user })
  } catch (err) {
    next(err)
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const data = await User.query().patchAndFetchById(req.params.id, req.body)

    delete data.password

    res.json({ user: data })
  } catch (err) {
    next(err)
  }
}

exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.query().findById(req.user.id)

    const validate = await bcrypt.compare(req.body.oldPassword, user.password)

    if (!validate) return next({ message: 'Old password is not correct' })

    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(req.body.newPassword, salt)

    const updatedUser = await User.query().patchAndFetchById(req.user.id, { password: hash })

    delete updatedUser.password

    res.json({ user: updatedUser })
  } catch (err) {
    next(err)
  }
}
