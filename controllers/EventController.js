const { transaction } = require('objection')

const Event = require('../models/Event')
const EventImage = require('../models/EventImage')
const EventDetails = require('../models/EventDetails')

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
    const event = await transaction(
      Event,
      EventImage,
      EventDetails,
      async (Event, EventImage, EventDetails) => {
        const eventDetails = JSON.parse(req.body.event_details)
        const additionalSettings = JSON.parse(req.body.additional_settings)

        const event = await Event.query().insert({
          title: eventDetails.title,
          start: eventDetails.start,
          end: eventDetails.end,
          city_name: eventDetails.city_name,
          latitude: eventDetails.latitude,
          longitude: eventDetails.longitude,
          userId: req.user.id
        })

        const images = req.files.map(image => ({
          eventId: event.id,
          image: image.filename
        }))

        await EventImage.query().insert(images)
        await EventDetails.query().insert({
          eventId: event.id,
          full_address: eventDetails.full_address,
          description: eventDetails.description,
          privacy: additionalSettings.privacy,
          password: additionalSettings.password,
          type: additionalSettings.type,
          topic: additionalSettings.topic
        })

        return event
      }
    )

    res.json({ event })
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
    const event = await transaction(
      Event,
      EventDetails,
      async (Event, EventDetails) => {
        const event = await Event.query().patchAndFetchById(
          req.params.eventId,
          { ...req.body.event, eventImage: req.file.path }
        )

        await EventDetails.query()
          .patch({ ...req.body.eventDetails })
          .where({ eventId: req.params.eventId })

        return event
      }
    )

    res.json({ event })
  } catch (err) {
    next(err)
  }
}

exports.searchEvents = async (req, res, next) => {
  try {
    const events = await Event.query()
      .join('event_details', 'events.id', '=', 'event_details.eventId')
      .skipUndefined()
      .where('title', 'like'`%${req.params.query}%`)
      .where('type', req.query.type)
      .where('topic', req.query.topic)
      .where('privacy', req.query.privacy)

    res.json({ events })
  } catch (err) {
    next(err)
  }
}

exports.joinEvent = async (req, res, next) => {
  try {
    const event = await Event.query().findById(req.params.eventId)

    await event.$relatedQuery('attendees').relate(req.body.id)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
