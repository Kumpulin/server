const { transaction } = require('objection')

const Event = require('../models/Event')
const EventDetails = require('../models/EventDetails')
const EventAttendees = require('../models/EventAttendees')

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.query()

    res.json({ events })
  } catch (err) {
    next(err)
  }
}

exports.createEvent = async (req, res, next) => {
  try {
    const event = await transaction(Event, EventDetails, async (Event, EventDetails) => {
      delete req.body.event.eventImage

      const event = await Event
        .query()
        .insert({ ...req.body.event, eventImage: req.file.path, userId: req.user.id })

      const eventDetails = await EventDetails
        .query()
        .insert({ eventId: event.id, ...req.body.eventDetails })

      return { ...event, ...eventDetails }
    })

    res.json({ ...event })
  } catch (err) {
    next(err)
  }
}

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.query().findById(req.params.eventId)

    res.json({ event })
  } catch (err) {
    next(err)
  }
}

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await transaction(Event, EventDetails, async (Event, EventDetails) => {
      delete req.body.event.eventImage

      const event = await Event
        .query()
        .patchAndFetchById(req.params.eventId, { ...req.body.event, eventImage: req.file.path })

      const eventDetails = await EventDetails
        .query()
        .patch({ ...req.body.eventDetails })
        .where({ eventId: req.params.eventId })

      return { ...event, ...eventDetails }
    })

    res.json({ ...event })
  } catch (err) {
    next(err)
  }
}

exports.searchEvents = async (req, res, next) => {
  try {
    const query = req.params.query

    if (query === '') {
      return next({ message: 'Please input keyword' })
    }

    const events = await Event.query().where({
      title: query,
      organizerName: query
    })

    res.json({ events })
  } catch (err) {
    next(err)
  }
}

exports.joinEvent = async (req, res, next) => {
  try {
    await EventAttendees.query().insert({ userId: req.user.id, eventId: req.params.eventId })

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
