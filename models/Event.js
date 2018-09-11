const { Model } = require('objection')

class Event extends Model {
  static get tableName () {
    return 'events'
  }

  static get idColumn () {
    return 'id'
  }

  static get relationMappings () {
    const User = require('./User')
    const EventImage = require('./EventImage')
    const EventDetails = require('./EventDetails')
    const EventAttendee = require('./EventAttendee')

    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'events.userId',
          to: 'users.id'
        }
      },

      images: {
        relation: Model.HasManyRelation,
        modelClass: EventImage,
        join: {
          from: 'events.id',
          to: 'event_images.eventId'
        }
      },

      details: {
        relation: Model.HasOneRelation,
        modelClass: EventDetails,
        join: {
          from: 'events.id',
          to: 'eventDetails.eventId'
        }
      },

      event: {
        relation: Model.HasManyRelation,
        modelClass: EventAttendee,
        join: {
          from: 'events.id',
          to: 'event_attendees.eventId'
        }
      },
    }
  }
}

module.exports = Event
