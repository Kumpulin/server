const express = require('express')
const multer = require('multer')
const router = express.Router()
const passport = require('passport')

const storage = require('../config/multer')
const EventController = require('../controllers/EventController')

const upload = multer({ storage })

router
  .route('/')
  .get(EventController.getAllEvents)
  .post(
    passport.authenticate('jwt', { session: false }),
    upload.array('images'),
    EventController.createEvent
  )

router
  .route('/:eventId')
  .get(EventController.getEventById)
  .patch(
    passport.authenticate('jwt', { session: false }),
    upload.array('images'),
    EventController.updateEvent
  )

router.get('/:eventId/details', EventController.getEventDetails)

router.post(
  '/:eventId/join',
  passport.authenticate('jwt', { session: false }),
  EventController.joinEvent
)

router.get('/search', (req, res) => EventController.searchEvents)

module.exports = router
