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
    const EventDetails = require('./EventDetails')
    const EventAttendees = require('./EventAttendees')

    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'events.userId',
          to: 'users.id'
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
        modelClass: EventAttendees,
        join: {
          from: 'events.id',
          to: 'event_attendees.eventId'
        }
      },
    }
  }
}

module.exports = Event
