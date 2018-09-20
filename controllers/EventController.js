const { transaction } = require('objection')
const format = require('date-fns/format')
const multiparty = require('multiparty')
const { uploadImage, deleteImage } = require('../config/aws')

const Event = require('../models/Event')
const EventImage = require('../models/EventImage')
const EventDetails = require('../models/EventDetails')

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.query()
      .skipUndefined()
      .where('title', 'like', `%${req.query.q}%`)

    res.json({ events })
  } catch (err) {
    next(err)
  }
}

exports.createEvent = async (req, res, next) => {
  try {
    const form = new multiparty.Form()

    form.parse(req, async (err, fields, files) => {
      if (err) return next(err)

      const event = await transaction(
        Event,
        EventImage,
        EventDetails,
        async (Event, EventImage, EventDetails) => {
          const eventDetails = JSON.parse(fields.event_details[0])
          const additionalSettings = JSON.parse(fields.additional_settings[0])

          const event = await Event.query().insert({
            title: eventDetails.title,
            start: format(eventDetails.start, 'YYYY-MM-DD HH:mm:ss'),
            end: format(eventDetails.end, 'YYYY-MM-DD HH:mm:ss'),
            city_name: eventDetails.city_name,
            latitude: eventDetails.latitude,
            longitude: eventDetails.longitude,
            userId: req.user.id
          })

          const { Key } = await uploadImage(files.image[0].path, 'events')

          await EventImage.query().insert({ eventId: event.id, image: Key })

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
    })
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

exports.getEventDetails = async (req, res, next) => {
  try {
    const event = await Event.query().findById(req.params.eventId)
    const images = await event.$relatedQuery('images')
    const details = await event.$relatedQuery('details')
    const creator = await event
      .$relatedQuery('creator')
      .select('users.name', 'users.id')
    const attendees = await event.$relatedQuery('attendees').select('users.id')

    const eventDetails = {
      ...images[0],
      ...details,
      user: creator,
      attendees: attendees.map(attendee => attendee.id)
    }

    delete eventDetails.id
    delete eventDetails.eventId
    delete eventDetails.created_at
    delete eventDetails.updated_at

    res.json(eventDetails)
  } catch (err) {
    next(err)
  }
}

exports.updateEvent = async (req, res, next) => {
  try {
    const form = new multiparty.Form()

    form.parse(req, async (err, fields, files) => {
      if (err) next(err)

      const event = await transaction(
        Event,
        EventImage,
        EventDetails,
        async (Event, EventImage, EventDetails) => {
          const eventDetails = JSON.parse(fields.event_details[0])
          const additionalSettings = JSON.parse(fields.additional_settings[0])

          const event = await Event.query().patchAndFetchById(
            req.params.eventId,
            {
              title: eventDetails.title,
              start: format(eventDetails.start, 'YYYY-MM-DD HH:mm:ss'),
              end: format(eventDetails.end, 'YYYY-MM-DD HH:mm:ss'),
              city_name: eventDetails.city_name,
              latitude: eventDetails.latitude,
              longitude: eventDetails.longitude
            }
          )

          if (files.image) {
            const images = await event.$relatedQuery('images')

            await deleteImage(images[0].image)

            const { Key } = await uploadImage(files.image[0].path, 'events')

            await EventImage.query()
              .patch({ image: Key })
              .where('eventId', req.params.eventId)
          }

          await EventDetails.query()
            .patch({
              full_address: eventDetails.full_address,
              description: eventDetails.description,
              privacy: additionalSettings.privacy,
              password: additionalSettings.password,
              type: additionalSettings.type,
              topic: additionalSettings.topic
            })
            .where('eventId', req.params.eventId)

          return event
        }
      )

      res.json({ event })
    })
  } catch (err) {
    next(err)
  }
}

exports.joinEvent = async (req, res, next) => {
  try {
    const event = await Event.query().findById(req.params.eventId)

    await event.$relatedQuery('attendees').relate(req.user.id)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
