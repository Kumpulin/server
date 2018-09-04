const User = require('../models/User')

exports.getUsers = async (req, res, next) => {
  try {
    const data = await User.query()
    const users = data.map(user => {
      delete user.password

      return user
    })

    res.json({ users })
  } catch (err) {
    next(err)
  }
}

exports.getUserById = async (req, res, next) => {
  try {
    const data = await User.query().findById(req.params.id)

    delete data.password

    res.json({ user: data })
  } catch (err) {
    next(err)
  }
}

exports.updateUserById = async (req, res, next) => {
  try {
    const data = await User.query().patchAndFetchById(req.params.id, req.body)

    delete data.password

    res.json({ user: data })
  } catch (err) {
    next(err)
  }
}

exports.deleteUserById = async (req, res, next) => {
  try {
    await User.query().deleteById(req.params.id)

    res.json({})
  } catch (err) {
    next(err)
  }
}
