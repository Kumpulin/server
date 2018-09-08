const express = require('express')
const multer = require('multer')
const router = express.Router()
const passport = require('passport')

const multerConfig = require('../config/multer')
const EventController = require('../controllers/EventController')

const upload = multer(multerConfig)

router.route('/')
  .get(EventController.getAllEvents)
  .post(passport.authenticate('jwt', { session : false }), upload.single('eventImage'), EventController.createEvent)

router.route('/:eventId')
  .get(EventController.getEventById)
  .patch(passport.authenticate('jwt', { session : false }), upload.single('eventImage'), EventController.updateEvent)

router.post('/:eventId/join', passport.authenticate('jwt', { session : false }), EventController.joinEvent)

router.get('/search/:query', (req, res) => EventController.searchEvents)

module.exports = router
