var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user            : 'j93jftbcfonj8ini',
  password        : 'osamknkkrovtt13p',
  database        : 'a7av3z8wi9ywzyhx'
});

module.exports.pool = pool;
