const { Model } = require('objection')

class EventDetails extends Model {
  static get tableName() {
    return 'event_details'
  }

  static get idColumn() {
    return 'id'
  }

  static get relationMappings() {
    const Event = require('./Event')

    return {
      event: {
        relation: Model.BelongsToOneRelation,
        modelClass: Event,
        join: {
          from: 'event_details.eventId',
          to: 'events.id'
        }
      }
    }
  }
}

module.exports = EventDetails
