const { ExtractJwt } = require('passport-jwt')

exports.fields = ['id', 'email', 'password']

exports.localOptions = {
  usernameField: 'email',
  session: false
}

exports.jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true
}
