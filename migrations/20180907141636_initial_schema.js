exports.up = knex => {
  return knex.schema
    .createTable('users', table => {
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
    })
    .createTable('events', table => {
      table.increments('id').primary()
      table.string('title').notNull()
      table.datetime('start').notNull()
      table.datetime('end').nullable()
      table.string('city_name').notNull()
      table.decimal('latitude', true).notNull()
      table.decimal('longitude', true).notNull()
      table.integer('userId').unsigned()
      table
        .foreign('userId')
        .references('id')
        .inTable('users')
      table.timestamps(true, true)
    })
    .createTable('event_images', table => {
      table.increments('id').primary()
      table.integer('eventId').unsigned()
      table
        .foreign('eventId')
        .references('id')
        .inTable('events')
      table.string('image').nullable()
      table.timestamps(true, true)
    })
    .createTable('event_details', table => {
      table.increments('id').primary()
      table.integer('eventId').unsigned()
      table
        .foreign('eventId')
        .references('id')
        .inTable('events')
      table.string('full_address').notNull()
      table.text('description').nullable()
      table.enu('privacy', ['PUBLIC', 'PRIVATE']).notNull()
      table.string('password').nullable()
      table.string('type').nullable()
      table.string('topic').nullable()
      table.timestamps(true, true)
    })
    .createTable('event_attendees', table => {
      table.increments('id').primary()
      table.integer('userId').unsigned()
      table
        .foreign('userId')
        .references('id')
        .inTable('users')
      table.integer('eventId').unsigned()
      table
        .foreign('eventId')
        .references('id')
        .inTable('events')
      table.timestamps(true, true)
    })
}

exports.down = knex => {
  return knex.schema
    .table('events', table => {
      table.dropForeign('userId')
    })
    .table('event_images', table => {
      table.dropForeign('eventId')
    })
    .table('event_details', table => {
      table.dropForeign('eventId')
    })
    .table('event_attendees', table => {
      table.dropForeign('userId')
      table.dropForeign('eventId')
    })
    .dropTableIfExists('events')
    .dropTableIfExists('users')
    .dropTableIfExists('event_images')
    .dropTableIfExists('event_details')
    .dropTableIfExists('event_attendees')
}
