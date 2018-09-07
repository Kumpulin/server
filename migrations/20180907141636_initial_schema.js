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
      table.timestamps(true, true)
    })
    .createTable('event_attendees', table => {
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
    .createTable('events', table => {
      table.increments('id').primary()
      table.string('title').notNull()
      table.date('startDate').notNull()
      table.time('startTime').notNull()
      table.date('endDate').nullable()
      table.time('endTime').nullable()
      table.decimal('latitude').notNull()
      table.decimal('longitude').notNull()
      table.string('organizerName').nullable()
      table.text('description').nullable()
      table.string('eventImage').nullable()
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
      table.timestamps(true, true)
    })
    .createTable('event_details', table => {
      table.increments('id').primary()
      table
        .integer('eventId')
        .unsigned()
        .references('id')
        .inTable('events')
      table.enu('privacy', ['PUBLIC', 'PRIVATE ']).notNull()
      table.string('type').nullable()
      table.string('topic').nullable()
      table.timestamps(true, true)
    })
}

exports.down = knex => {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('events')
    .dropTableIfExists('event_details')
}
