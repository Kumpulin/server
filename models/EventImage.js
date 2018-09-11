const { Model } = require('objection')

class EventImage extends Model {
  static get tableName () {
    return 'event_images'
  }

  static get idColumn () {
    return 'id'
  }

  static get relationMappings () {
    const Event = require('./Event')

    return {
      event: {
        relation: Model.BelongsToOneRelation,
        modelClass: Event,
        join: {
          from: 'event_images.eventId',
          to: 'events.id'
        }
      }
    }
  }
}

module.exports = EventImage
