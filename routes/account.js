const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/AccountController')

router.post('/update_profile', AccountController.updateProfile)
router.get('/current_user', AccountController.getCurrentUser)
router.post('/change_password', AccountController.changePassword)

module.exports = router
