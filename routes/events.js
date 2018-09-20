const express = require('express')
const router = express.Router()
const passport = require('passport')

const EventController = require('../controllers/EventController')

router
  .route('/')
  .get(EventController.getAllEvents)
  .post(
    passport.authenticate('jwt', { session: false }),
    EventController.createEvent
  )

router
  .route('/:eventId')
  .get(EventController.getEventById)
  .patch(
    passport.authenticate('jwt', { session: false }),
    EventController.updateEvent
  )

router.get('/:eventId/details', EventController.getEventDetails)

router.post(
  '/:eventId/join',
  passport.authenticate('jwt', { session: false }),
  EventController.joinEvent
)

module.exports = router
