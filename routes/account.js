const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/AccountController')

router.get('/joined', AccountController.getAllJoinedEvents)
router.get('/attended', AccountController.getAllAttendedEvents)

router.get('/current_user', AccountController.getCurrentUser)
router.post('/update_profile', AccountController.updateProfile)
router.post('/change_password', AccountController.changePassword)

module.exports = router
