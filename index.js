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
var tasks = [];
    
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
app.set('port', process.argv[2] || 13227);


app.get('/', function(req,res){
  var context = {};
  try{
    context.username = req.user.first_name;
    context.loginButton = "Account"
    context.loggedIn = true;
  } catch(e) {
    context.username = "Visitor"
    context.loginButton = "Login"
    context.loggedIn = false;
  }
  queryString = "SELECT * FROM tasks";
  newQueryString = "SELECT * FROM categories";
  getQuery(queryString)
  .then((rows) => {
    context.task = rows;
    tasks.push(rows);
  }).then(() => {
    return getQuery(newQueryString);
  }).then((rows) => {
    context.category = rows;
    res.render('landing', context);
  })
});

app.put('/', (req, res) => {
  var useremail = req.user.email;
  var user = users[0].find(user => user.email === useremail);
  var userid = user.id;
  var status = 200;
  var queryString = "INSERT INTO tasks (name, task_time, break_time, userid, categoryid) VALUES ((?), (?), (?), (?), (?));";
  if (req.body.newCategory){
    var newCatQuery = "INSERT INTO categories (name, userid) VALUES ((?), (?));";
    var getCatIDQuery = "SELECT MAX(id) FROM categories;";
    postQuery(newCatQuery, [req.body.category, userid])
    .then((result) => {
      status = 200;
    }).then(() => {
      return getQuery(getCatIDQuery);
    }).then((rows) => {
      let category = rows[0].id;
    }).then(() => {
      postQuery(queryString, [req.body.name, req.body.taskTime, req.body.breakTime, userid, category])
    }).then((result) => {
      res.sendStatus(200);
    })
  } else {
    postQuery(queryString, [req.body.name, req.body.taskTime, req.body.breakTime, userid, req.body.category])
    .then((result) => {
      res.sendStatus(200);
    })
  }
})
  
  postQuery(queryString, [req.body.name, req.body.taskTime, req.body.breakTime, userid, req.body.category])
  .then((result) => {
    if (newCatQuery != null){
      
    }
    res.sendStatus(200);
  })
})

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

app.get('/account', (req, res) => {
  res.render('account');
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

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/account')
  }
  next()
}

function getQuery(query) {
  //Takes a SQL statement as an argument and returns a promise which will provide the resulting SQL data array.
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
  //Takes a SQL statement and an array of parameters to inject into the statement. Returns a promise 
  // which returns the resulting SQL data array.
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
	() => console.log("Server is running on port", app.get('port'), "..."));