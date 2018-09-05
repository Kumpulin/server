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
}

exports.down = knex => {
  return knex.schema.dropTable('users')
}
