var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/imgs'));
app.use(express.static(__dirname));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 1324);


app.get('/',function(req,res){
  res.render('landing');
});


/*app.get('/eagle',function(req,res){
  var context = {};
  var tableResults = [];
  var queryString = "SELECT * FROM ShipSpecs WHERE Model = 'Eagle'";
  mysql.pool.query(queryString, function(err, rows, fields){
    for (var entry in rows){
      tableResults.push({'Spec': rows[entry]["Spec"], 'Value': rows[entry]["Value"]});
    }
    context.specTableResult = tableResults;
    res.render('eagle', context);
  });
});*/

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

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
