const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/AccountController')

router.get('/created_events', AccountController.getAllCreatedEvents)
router.get('/joined_events', AccountController.getAllJoinedEvents)
router.get('/attended_events', AccountController.getAllAttendedEvents)

router.get('/current_user', AccountController.getCurrentUser)
router.post('/update_profile', AccountController.updateProfile)
router.post('/change_password', AccountController.changePassword)

module.exports = router
