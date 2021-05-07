const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const config      = require('../configs/config');

var dbconn = mysql.createConnection({
  host: config.database.host,
  user: config.database.username,
  password: config.database.password,
  database: config.database.dbname
});

var sessionStore = new MySQLStore({}, dbconn);

function reconnect() {
  dbconn = mysql.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.dbname
  });
}


dbconn.on('error', function(err) {
   console.log('event db error ', err);
   if(err.code === 'PROTOCOL_CONNECTION_LOST') {
     reconnect();
   } else {
     reconnect();
     // throw err;
   }
 });

module.exports = dbconn;
