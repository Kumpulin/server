const { Model } = require('objection')

class EventAttendees extends Model {
  static get tableName () {
    return 'event_attendees'
  }

  static get idColumn () {
    return 'id'
  }

  static get relationMappings () {
    const User = require('./User')
    const Event = require('./Event')

    return {
      attendee: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'event_attendees.userId',
          to: 'users.id'
        }
      },

      event: {
        relation: Model.HasManyRelation,
        modelClass: Event,
        join: {
          from: 'event_attendees.eventId',
          to: 'events.id'
        }
      }
    }
  }
}

module.exports = EventAttendees
