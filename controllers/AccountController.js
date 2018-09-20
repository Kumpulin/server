const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.getAllCreatedEvents = async (req, res, next) => {
  try {
    const user = await User.query().findById(req.user.id)

    const liveEvents = await user
      .$relatedQuery('createdEvents')
      .where('start', '>=', new Date().toISOString())
    const pastEvents = await user
      .$relatedQuery('createdEvents')
      .where('end', '<=', new Date().toISOString())

    res.json({ events: { liveEvents, pastEvents } })
  } catch (err) {
    next(err)
  }
}

exports.getAllJoinedEvents = async (req, res, next) => {
  try {
    const user = await User.query().findById(req.user.id)

    const events = await user
      .$relatedQuery('joinedEvents')
      .where('start', '>=', new Date().toISOString())

    res.json({ events })
  } catch (err) {
    next(err)
  }
}

exports.getAllAttendedEvents = async (req, res, next) => {
  try {
    const user = await User.query().findById(req.user.id)

    const events = await user
      .$relatedQuery('joinedEvents')
      .where('end', '<=', new Date().toISOString())

    res.json({ events })
  } catch (err) {
    next(err)
  }
}

exports.getUserProfile = async (req, res, next) => {
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
    const data = await User.query()
      .skipUndefined()
      .patchAndFetchById(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        image: req.body.image
      })

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

    const updatedUser = await User.query().patchAndFetchById(req.user.id, {
      password: hash
    })

    delete updatedUser.password

    res.json({ user: updatedUser })
  } catch (err) {
    next(err)
  }
}
