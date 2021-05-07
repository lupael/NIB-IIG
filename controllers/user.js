const express = require('express');
var session = require('express-session');
const userModel = require('../models/user_model');
const config      = require('../configs/config');

const user = express.Router();
const request = require('request');


user.get('/',function(req,res){
  console.log("Url " + req.url);

  userModel.getAllUser((err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
      if(err === 'success'){
        res.render('admin/user_view', {
          title: 'User',
          message :'',
          items: rows
        });
      }
    }
  });
});



user.get('/add_user_frm',function(req, res){
  console.log("Url " + req.url);
  res.render('admin/user_add_frm', {
    title: 'User',
    message :''
  });

});

user.post('/add_user_now',function(req, res){
  console.log("Url " + req.url);

  userModel.addUserNow(req.body.name, req.body.username, req.body.password, req.body.email, req.body.phone, req.body.address, (err, result) => {
    if(err === 'error') {
      res.end(JSON.stringify({'status' : 'failed' , 'msg' : 'Failed to add user' }));
    }else if(err === 'warning'){
      res.end(JSON.stringify({'status' : 'warning' , 'msg' : result}));
    }else if(err === 'success'){
      res.end(JSON.stringify({'status' : 'success' , 'msg' : result}));
    }
  });
});


user.get('/edit_user_frm', (req, res) => {
  console.log("Url " + req.url);
  IndivUser = [];
  id_iig_user = req.query.id_iig_user;

  console.log("IIG User ID " + id_iig_user);

  userModel.getIndivUser(id_iig_user, (rows) => {
    res.render('admin/user_edit_frm', {
      title: 'User',
      message :'',
      IndivUser : rows
    });
  });
});

user.post('/edit_user_now',function(req, res){
  console.log("Url " + req.url);
  if(req.body.password.length > 0){
    password = req.body.password;
  }else{
    password =req.body.prv_password;
  }
  userModel.editUserNow(req.body.name, req.body.username,password, req.body.email, req.body.phone, req.body.address,req.body.id_iig_user, (err, result) => {
    // console.log(rows);
    if(err === 'error') {
      res.end(JSON.stringify({'status' : 'failed' , 'msg' : result }));
    }else if(err === 'success'){
      res.end(JSON.stringify({'status' : 'success' , 'msg' : result}));
    }else if(err === 'warning'){
      res.end(JSON.stringify({'status' : 'warning' , 'msg' : result}));
    }
  });
});



user.post('/delete_user_now',function(req, res){
  console.log("Url f" + req.url);
  console.log('id_iig_user '+ req.body.id_iig_user);

  userModel.deleteUserNow(req.body.id_iig_user,(err,result) => {
    if(err == 'success'){
        userModel.getAllUser((err, rows) => {
          // console.log(rows);
          if(err === 'success'){
            res.end(JSON.stringify({'status' : 'success' , 'msg' : 'Successfully deleted user' ,'data' : rows}));
          }
        });
    }
  });
});

module.exports = user;
