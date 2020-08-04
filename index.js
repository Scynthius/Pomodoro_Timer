var express = require('express'),
    app = express(),
    mysql = require('./dbcon.js'),
    bodyParser = require('body-parser'),
    handlebars = require('express-handlebars').create({defaultLayout:'main'}),
    passport = require("passport"), 
    flash = require("express-flash"),
    session = require("express-session"),
    bcrypt = require("bcrypt");
var users = [];
    
    const initializePassport = require('./javascript/passport-config')
    initializePassport(
      passport,
      email => users[0].find(user => user.email === email),
      id => users[0].find(user => user.id === id)
    )

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
  secret: "odin hammer",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname+'/imgs'));
app.use(express.static(__dirname));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 13227);


app.get('/', function(req,res){
  var context = {};
  try{
    context.username = req.user.first_name;
    context.loginButton = "Account"
  } catch(e) {
    context.username = "Visitor"
    context.loginButton = "Login"
  }
  res.render('landing', context);
});


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/login',checkNotAuthenticated, (req, res) => {
  users = [];
  queryString = "SELECT * FROM users";
  getQuery(queryString)
  .then((rows) => {
    users.push(rows)
    res.render('login');
  })
  
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register')
})

app.get('/alreadyloggedin', function (req, res) {
  res.render('alreadyloggedin')
})

app.post('/register', checkNotAuthenticated, (req, res) => {
  try {
    bcrypt.hash(req.body.password, 10, function(err, hash){
      queryString = "INSERT INTO `users`(`first_name`, `last_name`, `email`, `password`) VALUES ((?), (?), (?), (?))"
      postQuery(queryString, [req.body.firstName, req.body.lastName, req.body.email, hash])
      .then((result) => {
        res.sendStatus(200)
    })
    })
    
  } catch(error) {
    console.log(error)
    res.sendStatus(error)
  }
})

app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/account')
  }
  next()
}

function getQuery(query) {
  return new Promise((resolve, reject) => {
    mysql.pool.query(query, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    })
  })
}

function postQuery(query, params) {
  return new Promise((resolve, reject) => {
    mysql.pool.query(query, params, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(200);
    })
  })
}


app.listen(process.env.PORT || app.get('port'), 
	() => console.log("Server is running..."));
