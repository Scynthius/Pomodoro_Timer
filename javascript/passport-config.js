const localStrategy = require('passport-local').Strategy;
const mysql = require('./dbcon.js');

function initialize(passport){
    const authenticateUser = (email, password, done) => {
        let user = null
        const getUserFromSQL = function(callback){
            results = []
            let queryString = "SELECT * FROM `users` WHERE `email`=(?)";
            mysql.pool.query(queryString, [email], function(err, rows, fields){
            if (rows.length == 1){
                results.push(rows[0]);
                callback(results);
            }});
        }
        getUserFromSQL(function(results){
            if (results.length === 0) {
                return done(null, false, {message: 'Invalid email address.'});
            }
            try {
                if (password === results[0]["password"]) {
                    user = results[0]
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect password.'});
                }
            } catch (e) {
                return done(e);
            }
        })
        
    }
    passport.use(new localStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {return done(null, user)});
}


module.exports = initialize;