var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_frymanj',
  password        : 'odinhammer13',
  database        : 'cs361_frymanj'
});

module.exports.pool = pool;
