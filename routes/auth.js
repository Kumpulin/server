const express = require('express')
const passport = require('passport')
const router = express.Router()

const AuthController = require('../controllers/AuthController')

router.post('/signup', AuthController.signUp)
router.post('/signin', AuthController.signIn)
router.post('/refresh_token', AuthController.refreshToken)

// Google OAuth 2.0
router.get('/google', passport.authenticate('signInGoogle', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('signInGoogle', { session: false }), AuthController.OAuthCallback)

// Facebook OAuth 2.0
router.get('/facebook', passport.authenticate('signInFacebook', { scope: ['email'] }))
router.get('/facebook/callback', passport.authenticate('signInFacebook', { session: false }), AuthController.OAuthCallback)

module.exports = router
