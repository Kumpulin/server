const express = require('express')
const passport = require('passport')
const router = express.Router()

const AuthController = require('../controllers/AuthController')

router.post('/signup', AuthController.signUp)
router.post('/signin', AuthController.signIn)
router.post('/refresh_token', AuthController.refreshToken)

module.exports = router
