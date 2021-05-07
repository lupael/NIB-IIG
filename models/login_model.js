const db = require('./dbconnect');

var Login = {};


Login.verify_admin= function(username, password, callback) {
  console.log('Param ' + username);
  console.log('Param ' + password);
  db.query("SELECT * FROM iig_user where username='"+ username +"' and password = '"+ password +"';" , function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      if(result.length > 0){
        callback('success', result);
      }else{
        callback('Authentication Failed', result);
      }
    }
  });
}


Login.verify_user= function(username,password, callback) {
  console.log('Param ' + username);
  console.log('Param ' + password);
  db.query("SELECT * FROM net_user where net_user_username='"+username+"' and net_user_password = '"+password+"';" , function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      if(result.length > 0){
        callback('success', result);
      }else{
        callback('Authentication Failed', result);
      }
    }
  });
}



module.exports = Login;
