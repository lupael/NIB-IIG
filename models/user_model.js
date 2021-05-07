const db = require('./dbconnect');

var User = {};

User.getAllUser = function(callback) {
  db.query("SELECT * FROM iig_user;" , function (err, result, fields) {
    if (err) {
      console.log("MySql Error!");
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

User.getIndivUser = function(id_iig_user, callback) {

  db.query("SELECT * FROM iig_user where id_iig_user ='"+id_iig_user+"';" , function (err,result) {
    if(result){
      callback(result);
  }
  });
}

User.getAllZone = function(id_isp,callback) {
  db.query("SELECT * FROM zone where id_isp ='"+id_isp+"';" , function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}



User.addUserNow = function(name, username, password, email, phone, address, callback) {
  // user with same username check
  db.query("SELECT * FROM iig_user where username ='"+username+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'User with this username already exist !!!');
    }else{
      // IIG user Insert
      let today = new Date().toISOString().slice(0, 10);
      console.log('Param ' + today);
      let sql = "INSERT INTO `iig_user`(`name`, `username`, `password`, `email`, `phone`, `address`, `created_at`) ";
      sql += "VALUES('"+ name +"', '"+ username +"', '"+ password +"', '"+ email +"', '"+ phone +"', '"+ address +"', '"+ today +"')";
      console.log("SQL" + sql );
      db.query(sql , function (err, result, fields) {
        if (err) {
          callback('error', err);
        } else {
          callback('success', 'Successfully added users.');
        }
      });
    }
  });
}

User.editUserNow = function(name, username, password, email, phone, address,id_iig_user, callback) {

  db.query("SELECT * FROM iig_user where username ='"+username+"' and id_iig_user != '"+id_iig_user+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'User with this username already exist !!!');
    }else{
      let today = new Date().toISOString().slice(0, 10);
      console.log('Param ' + today);
      let sql = "UPDATE `iig_user` SET `name`='"+ name +"', `username`='"+ username +"', `password`='"+ password +"', `email`='"+ email +"', `phone`='"+ phone +"', `address`='"+ address +"' WHERE id_iig_user = '"+id_iig_user+"'";
      console.log("SQL" + sql );
      db.query(sql , function (err, result, fields) {
        if (err) {
          callback('error', 'Failed to Edit user');
        } else {
          if('(Rows matched: 1  Changed: 0  Warnings: 0' == result.message){
            callback('warning', 'No Change !!!');
          }else{
            callback('success', 'Successfully Edited user !!!');
          }
        }
      });
    }
  });
}


User.edit_customer_now= function(max_movie_allow,id_net_user, callback) {
  console.log('Param ' + max_movie_allow);
  console.log('id_net_user ' + id_net_user);
    db.query("UPDATE `net_user` SET `max_movie_allow`='"+max_movie_allow+"' WHERE id_net_user = '"+id_net_user+"';" , function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

User.deleteUserNow = function(id_iig_user, callback) {
  console.log('id_iig_user ' + id_iig_user);
  db.query("DELETE FROM `iig_user` WHERE `id_iig_user` = '"+id_iig_user+"';" , function (err, result, fields) {
    if (err) {
      console.log(err);
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

module.exports = User;
