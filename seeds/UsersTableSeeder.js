const faker = require('faker')
const bcrypt = require('bcrypt')

let users = []

for (let i = 0; i < 5; i++) {
  users.push(generateUser(faker.name.findName(), faker.internet.email(), 'secret'))
}

exports.seed = (knex, Promise) => {
  return knex('users').del()
    .then(() => knex('users').insert(users))
}

function generateUser (name, email, password) {
  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(password, salt)

  return {
    name: name,
    email: email,
    password: hash
  }
}
