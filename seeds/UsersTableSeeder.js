const faker = require('faker')
const bcrypt = require('bcrypt')

let users = []

for (let i = 0; i < 5; i++) {
  const name = faker.name.findName()
  const email = `${name.split(' ').join('').toLowerCase()}@gmail.com`

  users.push(generateUser(name, email, 'secret'))
}

exports.seed = (knex, Promise) => {
  return knex('users').del()
    .then(() => knex('users').insert(users))
}

function generateUser (name, email, password) {
  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(password, salt)

  return {
    name,
    email,
    password: hash
  }
}
