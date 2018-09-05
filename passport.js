const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const bcrypt = require('bcrypt')

const passportConfig = require('./config/passport')
const User = require('./models/User')

passport.use('signUp', new LocalStrategy(passportConfig.localOptions, async (email, password, done) => {
  try {
    let user

    user = await User.query().where({ email }).first()

    if (user) return done(null, {})

    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)

    user = await User.query().insert({
      email,
      password: hash
    })

    delete user.password

    return done(null, { ...user })
  } catch (err) {
    done(err, false)
  }
}))

passport.use('signIn', new LocalStrategy(passportConfig.localOptions, async (email, password, done) => {
  try {
    const user = await User.query().select(...passportConfig.fields).where({ email }).first()

    if (!user) done(null, false)

    const validate = await bcrypt.compare(password, user.password)

    if (!validate) done(null, false)

    delete user.password

    return done(null, user)
  } catch (err) {
    done(err, false)
  }
}))

passport.use('signInGoogle', new GoogleStrategy(passportConfig.googleOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.query().where({ googleId: profile.id }).first()

    if (!user) {
      const newUser = await User.query().insert({
        googleId: profile.id.toString(),
        name: profile.displayName,
        email: profile.emails[0].value
      })

      return done(null, newUser)
    }

    return done(null, user)
  } catch (err) {
    done(err)
  }
}))

passport.use('signInFacebook', new FacebookStrategy(passportConfig.facebookOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.query().where({ facebookId: profile.id }).first()

    if (!user) {
      const newUser = await User.query().insert({
        facebookId: profile.id.toString(),
        name: profile.displayName,
        email: profile.emails[0].value
      })

      return done(null, newUser)
    }

    return done(null, user)
  } catch (err) {
    done(err)
  }
}))

passport.use(new JWTStrategy(passportConfig.jwtOptions, async (req, payload, done) => {
  try {
    const user = await User.query().select(...passportConfig.fields).findById(payload.id)

    if (!user) return done(null, false)

    delete user.password

    req.user = user

    return done(null, user)
  } catch (err) {
    done(err, false)
  }
}))
