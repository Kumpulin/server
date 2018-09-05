const { Model } = require('objection')

class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get idColumn () {
    return 'id'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['email'],

      properties: {
        id: { type: 'integer' },
        googleId: { type: ['string', 'null'] },
        name: { type: ['string', 'null'] },
        email: { type: 'string' },
        password: { type: ['string', 'null'] }
      }
    }
  }
}

module.exports = User
