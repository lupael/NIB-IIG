const db = require('./dbconnect');

var Isp = {};

Isp.getAllIsp = function(callback) {
  db.query("SELECT * FROM isp;" , function (err, result, fields) {
    if (err) {
      console.log("MySql Error!");
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}


Isp.getAllZone = function(id_isp,callback) {
  db.query("SELECT * FROM zone where id_isp ='"+id_isp+"';" , function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

Isp.getAllPackage = function(id_isp,callback) {
  db.query("SELECT * FROM package where id_isp ='"+id_isp+"';" , function (err, result, fields) {
    if (err) {
      console.log("MySql Error!");
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

Isp.getIndivPackage = function(id_package, callback) {
  var sql = "SELECT * FROM package where id_package ='"+ id_package +"'";
  console.log(sql);

  db.query(sql , function (err, result) {
    if(result){
      callback(result);
    }
  });
}

Isp.addPackageNow = function(package_name,package_speed,package_price,package_type,id_isp, callback) {

  db.query("SELECT * FROM package where package_name ='"+package_name+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'Package with this name already exist !!!');
    }else{
      let sql = "INSERT INTO `package`(`package_name`, `package_speed`, `package_price`, `package_type`, `id_isp`) ";
      sql += "VALUES('"+ package_name +"', '"+ package_speed +"', '"+ package_price +"', '"+ package_type +"', '"+ id_isp +"')";
      console.log("SQL" + sql );
      db.query(sql , function (err, result, fields) {
        if (err) {
          callback('error', 'Failed to add package');
        } else {
          callback('success', 'Successfully added Package.');
        }
      });
    }
  });
}


Isp.editPackageNow = function(package_name,package_speed,package_price,package_type,id_package, callback) {

  db.query("SELECT * FROM package where package_name ='"+package_name+"' and id_package != '"+id_package+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'Package with this name already exist !!!');
    }else{
      let sql = "UPDATE `package` SET `package_name`='"+ package_name +"', `package_speed`='"+ package_speed +"' WHERE id_package = '"+id_package+"'";

      console.log("SQL" + sql );
      db.query(sql , function (err, result, fields) {
        if (err) {
          callback('error', 'Failed to Edit Package');
        } else {
          if('(Rows matched: 1  Changed: 0  Warnings: 0' == result.message){
            callback('warning', 'No Change !!!');
          }else{
            callback('success', 'Successfully Edited Package !!!');
          }
        }
      });
    }
  });
}


Isp.registerIspNow = function(name, isp_name, address, username, email,phone_number,pwd, callback) {

  db.query("SELECT * FROM users where username ='"+username+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'User with this name already exist !!!');
    }else{
      db.query("SELECT * FROM users where email ='"+email+"';" , function (err,result) {
        if(result.length > 0){
          callback('warning', 'User with this email already exist !!!');
        }else{
          let sql = "INSERT INTO `isp_registration`(`isp_name`, `address`, `name`, `phone`, `email`, `username`, `password`) ";
          sql += "VALUES('"+ isp_name +"', '"+ address +"', '"+ name +"', '"+ phone_number +"', '"+ email +"', '"+ username +"', '"+ pwd +"')";
          console.log("SQL" + sql );
          db.query(sql , function (err, result, fields) {
            if (err) {
              callback('error', 'Registration failed !!!');
            } else {
              callback('success', 'We will get in touch with you shortly.');
            }
          });
        }
      });
    }
  });
}



Isp.addIspNow = function(name, address, max_search_data, balance, callback) {

  db.query("SELECT * FROM isp where isp_name ='"+name+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'Isp with this name already exist !!!');
    }else{
      let today = new Date().toISOString().slice(0, 10);
      let code = Math.random().toString(36).substring(7);
      console.log('Param ' + today);
      let sql = "INSERT INTO `isp`(`isp_name`, `isp_code`, `isp_address`, `max_search_data`, `balance`, `created_at`) ";
      sql += "VALUES('"+ name +"', '"+ code +"', '"+ address +"', '"+ max_search_data +"', '"+ balance +"', '"+ today +"')";
      console.log("SQL" + sql );
      db.query(sql , function (err, result, fields) {
        if (err) {
          callback('error', 'Failed to add isp');
        } else {
          callback('success', 'Successfully added isp.');
          Isp.addSettingsInfo(name, address, max_search_data, result.insertId,(err, result) => {
            console.log('Settings Table Entry.');
          });
          Isp.addTemplateInfo(result.insertId,(err, result) => {
            console.log('Template Table Entry.');
          });
        }
      });
    }
  });
}

Isp.addSettingsInfo = function(name, address, max_search_data,insertId, callback){

  let sql = "INSERT INTO `zone`(`zone_name`, `id_isp`) ";
  sql += "VALUES('Default Zone','"+ insertId +"')";
  db.query(sql , function (err, res, fields) {
    var id_zone = res.insertId;
    //Make an array of values:
    var values = [
      ['isp_image','Screenshot from 2018-01-03 16-21-03.png',insertId],
      ['max_allowed_due','100',insertId],
      ['invoice_template','1',insertId],
      ['sms_client_code','abcdefghijklmnmazedabd',insertId],
      ['default_zone',id_zone,insertId],
      ['smtp_port','465',insertId],
      ['smtp_host','ssl://smtp.gmail.com',insertId],
      ['isp_password','lightcube2018',insertId],
      ['isp_email','lightcube2018@gmail.com',insertId],
      ['isp_description','Please pay by 10th of each Month',insertId],
      ['DateTimeInterval','120',insertId],
      ['NIBUPDATER_VERSION','',insertId],
      ['PPOE_VERSION','',insertId],
      ['NIB_VERSION','',insertId],
      ['query_limit','100',insertId],
      ['currency', 'Taka',insertId],
      ['reboot_pass','123456',insertId],
      ['sys_update','auto',insertId],
      ['isp_address',address,insertId],
      ['isp_name',name,insertId]
    ];
    console.log(values);
    db.query('INSERT INTO `settings` (`key`, `value`, `id_isp`) VALUES ? ', [values], function (err, result) {
      if (err) throw err;
      console.log("Number of Settings records inserted: " + result.affectedRows);
    });
  });



}


Isp.addTemplateInfo = function(insertId, callback){
  //Make an array of values:
  var values = [
    ['Dear %CUSTOMER_NAME% ,Your Internet bill is %BILL% . Invoice Number %INVOICE_NUMBER% ,LightCube Technologies .','billing_sms',insertId],
    ['Dear %CUSTOMER_NAME% , Please check attached Invoice #%INVOICE_NUMBER% .','billing_email',insertId],
    ['Your OTP is  %CODE%  Valid for 1 hour. Thanks for using LightCube WIFI.','otp',insertId]
  ];
  console.log(values);
  db.query('INSERT INTO `template` (`message`, `type`, `id_isp`) VALUES ? ', [values], function (err, result) {
    if (err) throw err;
    console.log("Number of Template records inserted: " + result.affectedRows);
  });
}



Isp.getAllIspRole = (id_isp, callback) => {
  var sql = "SELECT * FROM role WHERE id_isp='"+ id_isp +"'";

  db.query(sql, function (err, result, fields) {
    if (err) {
      console.log("MySql Error!");
      callback('error', err);
    } else {
      callback('success', result);
    }
  });

}


Isp.getAllModule = (id_role, callback) => {
  var sql = "Select module.id_module,module.module_name,module.module_code From module where is_active = 1 ORDER BY module.sorting_index asc";

  db.query(sql, function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

Isp.getAlloperation = (id_role, callback) => {
  var sql = "select * from operation left JOIN module_operation on operation.id_operation=module_operation.id_operation";

  db.query(sql, function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}


Isp.roleOperation = (id_role, callback) => {
  var sql = "select * from role_operation where id_role ='"+id_role+"'";

  db.query(sql, function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

Isp.addingPermission = function(id_role,id_module,id_operation, callback) {

  let sql = "INSERT INTO `role_operation`(`id_role`, `id_module`, `id_operation`) ";
  sql += "VALUES('"+ id_role +"', '"+ id_module +"', '"+ id_operation +"')";
  console.log("SQL" + sql );
  db.query(sql , function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

Isp.removingPermission = function(id_role,id_module,id_operation, callback) {

  let sql = "DELETE FROM `role_operation` WHERE `id_role` = '"+id_role+"' AND  `id_module` = '"+id_module+"' AND `id_operation` = '"+id_operation+"' ";
  console.log("SQL" + sql );
  db.query(sql , function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

Isp.editIspUserNow = function(full_name, user_name, email, phone, address, designation, id_role, pwd,id_user,callback) {

  db.query("SELECT * FROM users where email ='"+email+"' AND id != '"+id_user+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'User with this email already exist !!!');
    }else{
      db.query("SELECT * FROM users where phone ='"+phone+"' AND id != '"+id_user+"';" , function (err,result) {
        if(result.length > 0){
          callback('warning', 'User with this phone already exist !!!');
        }else{
          let sql = "UPDATE `users` SET `name`='"+ full_name +"', `username`='"+ user_name +"', `email`='"+ email +"', `phone`='"+ phone +"', `address`='"+ address +"', `designation`='"+ designation +"', `password`='"+ pwd +"' , `id_role`='"+ id_role +"' WHERE id = '"+id_user+"'";
          console.log("SQL" + sql );
          db.query(sql , function (err, result, fields) {
            if (err) {
              callback('error', 'Failed to Edit User');
            } else {
              console.log("SQL" + result.message );
              if('(Rows matched: 1  Changed: 0  Warnings: 0' == result.message){
                callback('warning', 'No Change !!!');
              }else{
                callback('success', 'Successfully Edited User !!!');
              }
            }
          });
        }
      });
    }
  });
}

Isp.addIspUserNow = function(full_name, user_name, email, phone, address, designation, id_role,id_zone, pwd,id_isp, callback) {

  db.query("SELECT * FROM users where email ='"+email+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'User with this email already exist !!!');
    }else{
      db.query("SELECT * FROM users where phone ='"+phone+"';" , function (err,result) {
        if(result.length > 0){
          callback('warning', 'User with this phone already exist !!!');
        }else{
          let sql = "INSERT INTO `users`(`id_isp`, `name`, `username`, `email`, `phone`, `designation`, `address`, `password`, `id_role`) ";
          sql += "VALUES('"+ id_isp +"', '"+ full_name +"', '"+ user_name +"', '"+ email +"', '"+ phone +"', '"+ designation +"', '"+ address +"', '"+ pwd +"', '"+ id_role +"')";
          console.log("SQL" + sql );
          db.query(sql , function (err, result, fields) {
            if (err) {
              console.log(err);
              callback('error', 'Failed to add user');
            } else {
              //zone access
              let sql = "INSERT INTO `zone_access`(`id_user`, `id_zone`) ";
              sql += "VALUES('"+ result.insertId +"', '"+ id_zone +"')";
              db.query(sql , function (err, result, fields) {
                //zone access
              });
              callback('success', "Successfully added user !!!!");
            }
          });
        }
      });
    }
  });
}


Isp.addIspUserRoleNow = function(id_isp, name, desc, callback) {

  db.query("SELECT * FROM role where role_name ='"+name+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'Role with this name already exist !!!');
    }else{
      let today = new Date().toISOString().slice(0, 10);
      console.log('Param ' + today);
      let sql = "INSERT INTO `role`(`id_isp`, `role_name`, `role_desc`, `id_module`) ";
      sql += "VALUES('"+ id_isp +"', '"+ name +"', '"+ desc +"', '1')";
      console.log("SQL" + sql );
      db.query(sql , function (err, result, fields) {
        if (err) {
          callback('error', 'Failed to add role');
        } else {
          callback('success', 'Successfully added role.');
        }
      });
    }
  });
}


Isp.getIndivUser = function(id_user, callback) {
  var sql = "SELECT * FROM users where id ='"+ id_user +"'";
  console.log(sql);

  db.query(sql , function (err, result) {
    if (err) {
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}


Isp.getIndivIsp = function(id_isp, callback) {
  var sql = "SELECT * FROM isp where id_isp ='"+ id_isp +"'";
  console.log(sql);

  db.query(sql , function (err, result) {
    if(result){
      callback(result);
    }
  });
}

Isp.getIndivRole = function(id_role, callback) {
  var sql = "SELECT * FROM role where id_role ='"+ id_role +"'";
  console.log(sql);

  db.query(sql , function (err, result) {
    if(result){
      callback(result);
    }
  });
}


Isp.getAllIspUser = (id_isp, callback) => {
  var sql = "SELECT * FROM users ";
  sql += "LEFT JOIN role ON users.id_role = role.id_role ";
  sql += "WHERE users.id_isp='"+ id_isp +"'";

  db.query(sql, function (err, result, fields) {
    if (err) {
      console.log("MySql Error!");
      callback('error', err);
    } else {
      callback('success', result);
    }
  });

}

Isp.editRoleNow = function(name, desc, id_role, callback) {

  db.query("SELECT * FROM role where role_name ='"+name+"' and id_role != '"+id_role+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'Role with this name already exist !!!');
    }else{
      let sql = "UPDATE `role` SET `role_name`='"+ name +"', `role_desc`='"+ desc +"' WHERE id_role = '"+id_role+"'";

      console.log("SQL" + sql );
      db.query(sql , function (err, result, fields) {
        if (err) {
          callback('error', 'Failed to Edit Role');
        } else {
          if('(Rows matched: 1  Changed: 0  Warnings: 0' == result.message){
            callback('warning', 'No Change !!!');
          }else{
            callback('success', 'Successfully Edited Role !!!');
          }
        }
      });
    }
  });
}


Isp.editIspNow = function(name, address, max_search_data, balance, id_isp ,is_active, callback) {

  db.query("SELECT * FROM isp where isp_name ='"+name+"' and id_isp != '"+id_isp+"';" , function (err,result) {
    if(result.length > 0){
      callback('warning', 'Isp with this name already exist !!!');
    }else{
      let sql = "UPDATE `isp` SET `isp_name`='"+ name +"', `isp_address`='"+ address +"', `max_search_data`='"+ max_search_data +"', `balance`='"+ balance +"', `is_active`='"+ is_active +"' WHERE id_isp = '"+id_isp+"'";

      console.log("SQL" + sql );
      db.query(sql , function (err, result, fields) {
        if (err) {
          callback('error', 'Failed to Edit Isp');
        } else {
          console.log("SQL" + result.message );
          if('(Rows matched: 1  Changed: 0  Warnings: 0' == result.message){
            callback('warning', 'No Change !!!');
          }else{
            callback('success', 'Successfully Edited Isp !!!');
          }
        }
      });
    }
  });
}

Isp.deleteIspNow = function(id_isp, callback) {
  console.log('id_isp ' + id_isp);
  db.query("DELETE FROM `isp` WHERE `id_isp` = '"+id_isp+"';" , function (err, result, fields) {
    if (err) {
      console.log(err);
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}

Isp.deleteUserNow = function(id_user, callback) {
  console.log('id_user ' + id_user);
  db.query("DELETE FROM `users` WHERE `id` = '"+id_user+"';" , function (err, result, fields) {
    if (err) {
      console.log(err);
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}



Isp.deletePackageNow = function(id_package, callback) {
  console.log('id_package ' + id_package);

  db.query("DELETE FROM `package` WHERE `id_package` = '"+id_package+"';" , function (err, result, fields) {
    if (err) {
      console.log(err);
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}


Isp.deleteRoleNow = function(id_role, callback) {
  console.log('id_role ' + id_role);
  db.query("DELETE FROM `role` WHERE `id_role` = '"+id_role+"';" , function (err, result, fields) {
    if (err) {
      console.log(err);
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}


Isp.getIspInfo = function(id_isp, callback) {
  let sql = "SELECT * FROM isp WHERE id_isp='"+ id_isp +"'";
  db.query(sql , function (err, result, fields) {
    if (err) {
      console.log("MySql Error!");
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}


module.exports = Isp;
