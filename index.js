var express = require('express'),
    app = express(),
    mysql = require('./dbcon.js'),
    bodyParser = require('body-parser'),
    handlebars = require('express-handlebars').create({defaultLayout:'main'}),
    passport = require("passport"), 
    flash = require("express-flash"),
    session = require("express-session");

    
const initializePassport = require('./javascript/passport-config');
initializePassport(
  passport, 
  email => {
    let queryString = "SELECT * FROM `users` WHERE `email`=(?)";
    let result = mysql.pool.query(queryString, [email], function(err, rows, fields){
      if (rows.length == 1){
        return rows[0];
      }});
    return result;
  }, 
  id => {
    let queryString = "SELECT * FROM `users` WHERE `id`=(?)";
    mysql.pool.query(queryString, [id], function(err, rows, fields){
      if (rows.length == 1){
        return rows[0]['id'];
      }});
  })

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
app.set('port', 1328);


app.get('/', checkAuth, function(req,res){
  var context = {};
  GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(getActivity());
  if (acct != null) {
    String personName = acct.getDisplayName();
    String personGivenName = acct.getGivenName();
    String personFamilyName = acct.getFamilyName();
    String personEmail = acct.getEmail();
    String personId = acct.getId();
    Uri personPhoto = acct.getPhotoUrl();
  }
  context.
  res.render('landing');
});

app.get('/login',function(req,res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', function(req,res){
  res.render('register')
})

app.post('/register', function(req, res){
  try {
    users.push({
      id: Date.now().toString(),
      first_name: req.body.fName,
      last_name: req.body.lName,
      email: req.body.email,
      password: req.body.password
    });
    res.redirect('/login');
  } catch(e) {
    res.redirect('/register');
  }

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

function checkAuth(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    //Redirect if user is not logged in.
    return next();
  }
}
/*
async function sqlEmail(email) {
  let queryString = "SELECT * FROM `users` WHERE `email`=(?)";
  mysql.pool.query(queryString, [email], function(err, rows, fields){
    if (rows.length == 1){
      for (var item in rows[0]){
        console.log(item)
        console.log(rows[0][item])
      }
      return rows[0];
    }
  })
}
*/
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
