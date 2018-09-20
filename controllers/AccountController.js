const User = require('../models/User')
const bcrypt = require('bcryptjs')
const multiparty = require('multiparty')
const { uploadImage, deleteImage } = require('../config/aws')

const form = new multiparty.Form()

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

exports.updateProfileImage = async (req, res, next) => {
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) return next(err)

      const user = await User.query().findById(req.user.id)

      await deleteImage(user.image)

      const { Key } = await uploadImage(files.image[0].path, 'users')

      const updatedUser = await User.query().patchAndFetchById(req.user.id, {
        image: Key
      })

      delete user.password

      res.json({ user: updatedUser })
    })
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
