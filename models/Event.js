const { Model } = require('objection')

class Event extends Model {
  static get tableName() {
    return 'events'
  }

  static get idColumn() {
    return 'id'
  }

  static get relationMappings() {
    const User = require('./User')
    const EventImage = require('./EventImage')
    const EventDetails = require('./EventDetails')

    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'events.userId',
          to: 'users.id'
        }
      },

      attendees: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'events.id',
          through: {
            from: 'event_attendees.eventId',
            to: 'event_attendees.userId'
          },
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
          to: 'event_details.eventId'
        }
      }
    }
  }
}

module.exports = Event
