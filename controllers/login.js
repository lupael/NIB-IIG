const express = require('express');
var session = require('express-session');
const loginModel = require('../models/login_model');
const config      = require('../configs/config');

const login = express.Router();
const request = require('request');


login.get('/',function(req,res){
  console.log("Url " + req.url);
  res.render('admin/admin_login', {
    title: 'Welcome',
    message :''
  });
});


login.post('/verify_admin',function(req,res){

  console.log(`Url ${req.url}`);

  loginModel.verify_admin(req.body.username, req.body.password,(err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
      if(err === 'success'){
        req.session.id_iig_user = rows[0].id_iig_user;
        res.end(JSON.stringify({'status' : 'success' , 'msg' : err }));
      }else{
        res.end(JSON.stringify({'status' : 'failed' , 'msg' : err }));
      }
    }
  });

});

login.get('/logout',function(req,res){
  console.log("Url " + req.url);

  req.session.destroy(function(err) {
 if(err) {
   console.log(err);
 } else {
   res.render('admin/admin_login', {
     title: 'Welcome',
     message :''
   });
 }
});

});


module.exports = login;
