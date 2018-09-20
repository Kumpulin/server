const express = require('express')
const multer = require('multer')

const router = express.Router()
const storage = require('../config/multer')
const upload = multer({ storage })

const AccountController = require('../controllers/AccountController')

router.get('/created_events', AccountController.getAllCreatedEvents)
router.get('/joined_events', AccountController.getAllJoinedEvents)
router.get('/attended_events', AccountController.getAllAttendedEvents)

router.get('/', AccountController.getUserProfile)
router.patch(
  '/update_profile_image',
  upload.single('image'),
  AccountController.updateProfileImage
)
router.post('/change_password', AccountController.changePassword)

module.exports = router
