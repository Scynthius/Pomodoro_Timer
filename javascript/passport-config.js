const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = function (email, password, done) {
    const user = getUserByEmail(email)
    
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }
    console.log(user)
    try {
      bcrypt.compare(password, user.password).then(function(result){
        if(result){
          return done(null, user)
        } else {
          console.log(user.password)
          return done(null, false, { message: 'Password incorrect' })
        }
      })
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize