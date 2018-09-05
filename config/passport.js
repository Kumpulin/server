const { ExtractJwt } = require('passport-jwt')

exports.fields = ['id', 'email', 'password']

exports.localOptions = {
  usernameField: 'email',
  session: false
}

exports.googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8081/api/auth/google/callback"
}

exports.jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true
}
