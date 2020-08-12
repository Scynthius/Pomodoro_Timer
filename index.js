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
  if(!req.isAuthenticated()) {
    var context = {};
    context.username = "Visitor";
    queryString = "SELECT tasks.id, tasks.name, tasks.task_time, tasks.break_time, tasks.userid, categories.name AS catname FROM tasks JOIN categories ON tasks.categoryid = categories.id";
    newQueryString = "SELECT * FROM categories";
    getQuery(queryString, userid)
    .then((rows) => {
      context.task = rows;
      tasks.push(rows);
    }).then(() => {
      return getQuery(newQueryString);
    }).then((rows) => {
      context.category = rows;
      res.render('landing', context);
    })
  }
  else {
    var context = {};
    initializeUser(req, context);
    var useremail = req.user.email;
    var user = users[0].find(user => user.email === useremail);
    var userid = user.id;
    queryString = "SELECT tasks.id, tasks.name, tasks.task_time, tasks.break_time, tasks.userid, categories.name AS catname FROM tasks JOIN categories ON tasks.categoryid = categories.id WHERE tasks.userid=(?)";
    newQueryString = "SELECT * FROM categories";
    getQuery(queryString, userid)
    .then((rows) => {
      context.task = rows;
      tasks.push(rows);
    }).then(() => {
      return getQuery(newQueryString);
    }).then((rows) => {
      context.category = rows;
      res.render('landing', context);
    })
  }
});

app.get('/progress', function(req, res) {
  var context = {};
  initializeUser(req, context);
  console.log(req.user);
  queryString = "SELECT * FROM performance WHERE userid="+req.user.id;
  badgeQueryString = "SELECT * FROM badges";
  getQuery(queryString)
  .then((rows) => {
    context.performance = rows;
  }).then(() =>{
    return getQuery(badgeQueryString)
  }).then((rows) =>{
    context.badges = rows;
    res.render('progress', context);
  })
});

app.put('/', (req, res, next) => {
  var useremail = req.user.email;
  var user = users[0].find(user => user.email === useremail);
  var userid = user.id;
  var status = 200;
  var queryString = "INSERT INTO tasks (name, task_time, break_time, userid, categoryid) VALUES ((?), (?), (?), (?), (?));";
  if (req.body.newCategory){
    console.log("New category detected.");
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
      return postQuery(queryString, [req.body.name, req.body.taskTime, req.body.breakTime, userid, category])
    }).then((result) => {
      res.sendStatus(200);
    })
  } else {
    console.log("Using old category.");
    postQuery(queryString, [req.body.name, req.body.taskTime, req.body.breakTime, userid, req.body.category])
    .then((result) => {
      res.sendStatus(200);
    })
  }
});

app.put('/completed', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(200);
  }
  var useremail = req.user.email;
  var user = users[0].find(user => user.email === useremail);
  var userid = user.id;
  var category;
  var queryString = "INSERT INTO performance (task, userid, sessionid, categoryid, task_time, break_time) VALUES ((?), (?), (?), (?), (?), (?));";
  var getCatIDQuery = "SELECT id FROM categories WHERE name=(?);";
  getQuery(getCatIDQuery)
  .then((rows) => {
    category = rows[0].id;
  }).then(() => {
    return postQuery(queryString, [req.body.name, userid, req.sessionID, category, req.body.taskTime, req.body.breakTime]);
  }).then((result) => {
    res.sendStatus(200);
  })
});

app.get('/completed', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(200);
  }
  else {
    var useremail = req.user.email;
    var user = users[0].find(user => user.email === useremail);
    var userid = user.id;
    console.log("user id:", userid);
    var taskQty;
    var sameTaskQty;
    var performance;
    var user_badges;
    var badges;
    queryString = "SELECT COUNT(task) AS taskqty FROM performance WHERE userid=(?)";
    query0String = "SELECT userid, sessionid, task_time, break_time FROM performance WHERE userid=(?)";
    query2String = "SELECT * FROM user_earned_badges WHERE userid=(?)";
    query3String = "SELECT * FROM badges";
    query4String = "SELECT COUNT(task) AS sameTaskQty, sessionid, userid FROM performance WHERE userid=(?) GROUP BY sessionid";
    getQuery(queryString, userid)
    .then((rows) => {
      taskQty = rows;
    }).then(() => {
      return getQuery(query0String, userid);
    }).then((rows) => {
      performance = rows;
    }).then(() => {
      return getQuery(query2String, userid);
    }).then((rows) => {
      user_badges = rows;
    }).then(() => {
      return getQuery(query3String);
    }).then((rows) => {
      badges = rows;
    }).then(() => {
      return getQuery(query4String, userid);
    }).then((rows) => {
      sameTaskQty = rows;
    }).then(() => {
      console.log("performance: ", performance);
      console.log("user_badges: ", user_badges);
      console.log("badges: ", badges);
      console.log("sameTaskQty: ", sameTaskQty);
      console.log("taskQty: ", taskQty);
      badges.forEach(element => {
        giveBadge = true;
        console.log(element.id);
        user_badges.forEach(userBadge => {
          if (element.id == userBadge.badgeid) {
            console.log("User already has this badge.");
            giveBadge = false;
          }
        })
        if (element.taskqty <= taskQty[0].taskqty && element.samesession == 0 && giveBadge == true) {
          //add badge to user
          queryString = "INSERT INTO user_earned_badges (userid, badgeid) VALUES ((?), (?))";
          postQuery(queryString, [userid, element.id])
          .then((result) => {
            console.log("Badge id ", element.id, "given to user", userid);
          })
        }
        else if (element.samesession == 1 && giveBadge == true) {
          sameTaskQty.forEach(sameQty => {
            if (element.taskqty <= sameQty.sameTaskQty) {
              queryString = "INSERT INTO user_earned_badges (userid, badgeid) VALUES ((?), (?))";
              postQuery(queryString, [userid, element.id])
              .then((result) => {
                console.log("Badge id ", element.id, "given to user", userid);
              })
            }
          })
        }
      });
      res.sendStatus(200);
    })
  }
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/login',checkNotAuthenticated, (req, res) => {
  context = {};
  initializeUser(req, context);
  users = [];
  queryString = "SELECT * FROM users";
  getQuery(queryString)
  .then((rows) => {
    users.push(rows)
    res.render('login', context);
  })
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  context = {};
  initializeUser(req, context);
  res.render('register', context);
})

app.get('/alreadyloggedin', function (req, res) {
  context = {};
  initializeUser(req, context);
  res.render('alreadyloggedin', context);
})

app.get('/account', (req, res) => {
  context = {};
  context.first_name = req.user.first_name;
  context.last_name = req.user.last_name;
  context.email = req.user.email;
  initializeUser(req, context);
  res.render('account', context);
})

app.put('/account', (req, res) => {
  if (req.body.password){
    bcrypt.hash(req.body.password, 10, function(err, hash){
      let data = [req.body.email, hash, req.body.firstName, req.body.lastName, req.user.id];
    
      let queryString = `UPDATE users SET email = (?), password = (?), first_name = (?), last_name = (?) WHERE id = (?)`
      postQuery(queryString, data)
      .then((result) => {
        req.logOut();
        res.sendStatus(200);
    })
    })
  } else {
    let data = [req.body.email, req.body.firstName, req.body.lastName, req.user.id];
    let queryString = `UPDATE users SET email = (?), first_name = (?), last_name = (?) WHERE id = (?)`
    postQuery(queryString, data)
    .then((result) => {
      req.logOut();
      res.sendStatus(200);
    })
  }
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

function initializeUser(req, context) {
  if (req.isAuthenticated()) {
      context.username = req.user.first_name;
      context.loginButton = "Account"
      context.loggedIn = true;
  } else {
    context.username = "Visitor"
    context.loginButton = "Login"
    context.loggedIn = false;
  }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/account')
  }
  next()
}

function getQuery(query, params) {
  //Takes a SQL statement as an argument and returns a promise which will provide the resulting SQL data array.
  return new Promise((resolve, reject) => {
    mysql.pool.query(query, params, function (err, rows, fields) {
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
