exports.up = knex => {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary()
      table.string('googleId').nullable()
      table.string('facebookId').nullable()
      table.string('name').nullable()
      table.string('email').unique()
      table.string('password').nullable()
      table.string('resetPasswordToken').nullable()
      table.string('resetPasswordExpires').nullable()
      table.string('image')
      table.timestamps(true, true)
    }),
    knex.schema.createTable('events', table => {
      table.increments('id').primary()
      table.string('title').notNull()
      table.datetime('start').notNull()
      table.datetime('end').nullable()
      table.string('city_name').notNull()
      table.decimal('latitude').notNull()
      table.decimal('longitude').notNull()
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
      table.timestamps(true, true)
    }),
    knex.schema('event_images', table => {
      table.increments('id').primary()
      table
        .integer('eventId')
        .unsigned()
        .references('id')
        .inTable('events')
      table.string('image').nullable()
      table.timestamps(true, true)
    }),
    knex.schema.createTable('event_details', table => {
      table.increments('id').primary()
      table
        .integer('eventId')
        .unsigned()
        .references('id')
        .inTable('events')
      table.string('full_address').notNull()
      table.text('description').nullable()
      table.enu('privacy', ['PUBLIC', 'PRIVATE']).notNull()
      table.string('password').nullable()
      table.string('type').nullable()
      table.string('topic').nullable()
      table.timestamps(true, true)
    }),
    knex.schema.createTable('event_attendees', table => {
      table.increments('id').primary()
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
      table
        .integer('eventId')
        .unsigned()
        .references('id')
        .inTable('events')
      table.timestamps(true, true)
    })
  ])
}

exports.down = knex => {
  return knex.schema
    .dropTable('users')
    .dropTable('events')
    .dropTable('event_details')
    .dropTable('event_attendees')
}
