const express = require('express');
var session = require('express-session');
const ispModel = require('../models/isp_model');
const config      = require('../configs/config');
const isp = express.Router();
const request = require('request');
const nodemailer = require('nodemailer');

isp.post('/sendMail',function(req,res){
   var name   = req.body.name;
   var email  = req.body.email;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lightcube2018@gmail.com',
      pass: 'lightcube2018'
    }
  });

  var mailOptions = {
    from: 'lightcube2018@gmail.com',
    to: email,
    subject: 'LightCube Technology Registration',
    text: 'Dear '+name+',\n\tYou have Successfully registered your isp, We will get in touch with you shortly.\n\n Regards,\n LightCube Technology'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

isp.get('/package',function(req,res){
  console.log("Url " + req.url);
  var id_isp = req.query.id_isp;

  ispModel.getAllPackage(req.query.id_isp,(err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
      if(err === 'success'){
        res.render('admin/package_view', {
          title: 'ISP',
          message :'',
          items: rows,
          id_isp : req.query.id_isp
        });
      }
    }
  });
});


isp.post('/delete_package_now',function(req, res){
  console.log("Url f" + req.url);
  console.log('id_package '+ req.body.id_package);
  console.log('id_isp '+ req.body.id_isp);

  ispModel.deletePackageNow(req.body.id_package,(err,result) => {
    // console.log(rows);
    if(err === 'success'){
      ispModel.getAllPackage(req.body.id_isp, (err,data) => {
        if(err === 'success'){
          res.end(JSON.stringify({'status' : 'success' , 'msg' : 'Successfully deleted Package' ,'data' : data}));
        }
      });
    }
  });
});

isp.get('/edit_package_frm/:id_package',function(req,res){
  console.log("Url " + req.url);

  var id_package =[req.params.id_package][0]; // grab the id_package

  ispModel.getIndivPackage(id_package, (rows) => {
    console.log(rows);
    res.render('admin/edit_package_frm', {
      title: 'ISP',
      message :'',
      IndivPackage : rows
    });
  });
});

isp.post('/edit_package_now',function(req, res){
  console.log("Url " + req.url);

  ispModel.editPackageNow(req.body.package_name, req.body.package_speed, req.body.package_price, req.body.package_type,req.body.id_package, (err, result) => {
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

isp.get('/add_package_frm',function(req, res){
  console.log("Url " + req.url);
  var id_isp = req.query.id_isp; // grab the id_isp
    res.render('admin/add_package_frm', {
      title: 'ISP',
      message :'',
      id_isp : id_isp
    });
});

isp.post('/add_package_now',function(req, res){
  console.log("Url " + req.url);
  ispModel.addPackageNow(req.body.package_name, req.body.package_speed, req.body.package_price, req.body.package_type,req.body.id_isp, (err, result) => {
    // console.log(rows);
    if(err === 'error') {
      res.end(JSON.stringify({'status' : 'failed' , 'msg' : result }));
    }else if(err === 'warning') {
      res.end(JSON.stringify({'status' : 'warning' , 'msg' : result }));
    }else if(err === 'success'){
      res.end(JSON.stringify({'status' : 'success' , 'msg' : result}));
    }
  });
});

isp.get('/',function(req,res){
  console.log("Url " + req.url);

  ispModel.getAllIsp((err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
      if(err === 'success'){
        res.render('admin/isp_view', {
          title: 'ISP',
          message :'',
          items: rows
        });
      }
    }
  });
});

isp.get('/grant_permission/:id_role/:id_isp',function(req, res){

  var id_role =[req.params.id_role][0]; // grab the id_role
  var id_isp =[req.params.id_isp][0]; // grab the id_role

  console.log("Url " + req.url);
  res.render('admin/role_module_permission', {
    title: 'User',
    message :'',
    id_role : id_role,
    id_isp : id_isp
  });

});

isp.get('/isp_registration',function(req, res){
  console.log("Url " + req.url);
  res.render('admin/isp_registration', {
    title: 'ISP',
    message :''
  });

});


isp.get('/add_isp_frm',function(req, res){
  console.log("Url " + req.url);
  res.render('admin/isp_add_frm', {
    title: 'ISP',
    message :''
  });

});



isp.post('/isp_registration_now',function(req, res){
  console.log("Url " + req.url);
  console.log("isp_name " + req.body.isp_name);

  ispModel.registerIspNow(req.body.name,req.body.isp_name, req.body.address, req.body.username, req.body.email,req.body.phone_number,req.body.pwd, (err, result) => {
    // console.log(rows);
    if(err === 'error') {
      res.end(JSON.stringify({'status' : 'failed' , 'msg' : result }));
    }else if(err === 'warning') {
      res.end(JSON.stringify({'status' : 'warning' , 'msg' : result }));
    }else if(err === 'success'){
      res.end(JSON.stringify({'status' : 'success' , 'msg' : result}));
    }
  });

});


isp.post('/get_ind_module_operations',function(req, res){
  console.log("Url " + req.url);
  console.log("id_role " + req.body.id_role);

  ispModel.getAllModule(req.body.id_role, (err, modules) => {
    if(err === 'success') {
      ispModel.getAlloperation(req.body.id_role, (err, operations) => {
        if(err === 'success') {
          ispModel.roleOperation(req.body.id_role, (err, roleoperations) => {
            if(err === 'success') {
              res.end(JSON.stringify({'all_modules' : modules , 'indv_role_operations' : roleoperations, 'all_operations': operations}));
            }
          });
        }
      });
    }
  });
});




isp.post('/add_permission_now',function(req, res){
  id_role= req.body.id_role;
  id_operation= req.body.id_operation;
  id_module= req.body.id_module;
  check_state= req.body.check_state;
  // error_log("id_module:".$id_module." -- id_sub_module:".$id_sub_module." check_state:".$check_state);

  // Permission ADDING
  if(check_state == 1){

    ispModel.addingPermission(id_role,id_module,id_operation, (err, roleoperations) => {
      if(err === 'success') {
        res.end(JSON.stringify({'status' : 'success', 'msg' : 'Permission Added !'}));
      }else{
        res.end(JSON.stringify({'status' : 'failed', 'msg' : 'Failed !'}));
      }
    });
  }
  // Permission REMOVE
  else{
    ispModel.removingPermission(id_role,id_module,id_operation, (err, roleoperations) => {
      if(err === 'success') {
        res.end(JSON.stringify({'status' : 'success', 'msg': 'Permission Removed !'}));
      }else{
        res.end(JSON.stringify({'status' : 'failed', 'msg' : 'Failed !'}));
      }
    });
  }
});

isp.post('/delete_user_now',function(req, res){
  console.log("Url fss" + req.url);
  console.log('id_user '+ req.body.id_user);
  console.log('id_isp '+ req.body.id_isp);

  ispModel.deleteUserNow(req.body.id_user,(err,result) => {
    // console.log(rows);
    if(err === 'success'){
      ispModel.getAllIspUser(req.body.id_isp, (err,data) => {
        if(err === 'success'){
          res.end(JSON.stringify({'status' : 'success' , 'msg' : 'Successfully deleted User !!!' ,'data' : data}));
        }
      });
    }
  });
});


isp.post('/delete_role_now',function(req, res){
  console.log("Url f" + req.url);
  console.log('id_role '+ req.body.id_role);
  console.log('id_isp '+ req.body.id_isp);

  ispModel.deleteRoleNow(req.body.id_role,(err,result) => {
    // console.log(rows);
    if(err === 'success'){
      ispModel.getAllIspRole(req.body.id_isp, (err,data) => {
        if(err === 'success'){
          res.end(JSON.stringify({'status' : 'success' , 'msg' : 'Successfully deleted Role' ,'data' : data}));
        }
      });
    }
  });
});

isp.post('/add_isp_now',function(req, res){
  console.log("Url " + req.url);
  ispModel.addIspNow(req.body.name, req.body.address, req.body.max_search_data, req.body.balance, (err, result) => {
    // console.log(rows);
    if(err === 'error') {
      res.end(JSON.stringify({'status' : 'failed' , 'msg' : result }));
    }else if(err === 'warning') {
      res.end(JSON.stringify({'status' : 'warning' , 'msg' : result }));
    }else if(err === 'success'){
      res.end(JSON.stringify({'status' : 'success' , 'msg' : result}));
    }
  });
});

isp.get('/add_isp_user_frm',function(req, res){
  console.log("Url " + req.url);
  var id_isp = req.query.id_isp; // grab the id_isp

  ispModel.getAllIspRole(id_isp, (err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
      console.log("Calling info isp ");
      ispModel.getIndivIsp(id_isp, (result) => {
        ispModel.getAllZone(req.query.id_isp, (err, zone) => {
          if(err === 'success') {
            console.log("zone " +zone);
            res.render('admin/isp_add_user_frm', {
            title: 'ISP',
            message :'',
            Roles: rows,
            IspInfo: result,
            zone : zone
          });
          }
        });


      });
    }
  });
});


isp.get('/edit_isp_user_frm/:id_user/:id_isp',function(req,res){
  console.log("Url " + req.url);

  var id_user =[req.params.id_user][0]; // grab the id_user
    var id_isp =[req.params.id_isp][0]; // grab the id_isp

  ispModel.getIndivUser(id_user, (err,rows) => {

    if(err ='success'){
      ispModel.getAllIspRole(id_isp, (err, roles) => {
        // console.log(rows);
        if(err === 'error') {
          res.render('error', {
            title: 'NIBFlix'
          });
        } else {
          res.render('admin/edit_isp_user_frm', {
            title: 'ISP',
            message :'',
            IndivUser : rows,
            Roles : roles,
          });
        }
      });
    }else{
      res.render('error', {
        title: 'NIBFlix'
      });
    }
  });
});



isp.get('/edit_role_frm/:id_role',function(req,res){
  console.log("Url " + req.url);

  var id_role =[req.params.id_role][0]; // grab the id_role

  ispModel.getIndivRole(id_role, (rows) => {
    console.log(rows);
    res.render('admin/edit_role_frm', {
      title: 'ISP',
      message :'',
      IndivRole : rows
    });
  });
});


isp.get('/edit_isp_frm/:id_isp',function(req,res){
  console.log("Url " + req.url);

  var id_isp =[req.params.id_isp][0]; // grab the id_movie_series

  ispModel.getIndivIsp(id_isp, (rows) => {
    res.render('admin/isp_edit_frm', {
      title: 'ISP',
      message :'',
      IndivIsp : rows
    });
  });
});



isp.post('/edit_role_now',function(req, res){
  console.log("Url " + req.url);

  ispModel.editRoleNow(req.body.name, req.body.desc, req.body.id_role, (err, result) => {
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


isp.post('/edit_isp_now',function(req, res){
  console.log("Url " + req.url);
  let is_active;
  if(req.body.is_active == undefined){
    is_active = 0
  }else{
    is_active =1
  }
  console.log('is_active  ' + is_active);

  ispModel.editIspNow(req.body.name, req.body.address, req.body.max_search_data, req.body.balance,req.body.id_isp,is_active, (err, result) => {
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


isp.post('/delete_isp_now',function(req, res){
  console.log("Url f" + req.url);
  console.log('id_isp '+ req.body.id_isp);

  ispModel.deleteIspNow(req.body.id_isp,(err,result) => {
    if(err == 'success'){
      ispModel.getAllIsp((err, rows) => {
          // console.log(rows);
          if(err === 'success'){
            res.end(JSON.stringify({'status' : 'success' , 'msg' : 'Successfully deleted ISP' ,'data' : rows}));
          }
        });
    }
  });
});


isp.post('/edit_isp_user_now',function(req, res){
  console.log("Url " + req.url);

  if(req.body.pwd.length > 0){
    password = req.body.pwd;
  }else{
    password = req.body.prv_password;
  }

  ispModel.editIspUserNow(req.body.full_name, req.body.user_name, req.body.email, req.body.phone, req.body.address, req.body.designation, req.body.id_role,password,req.body.id_user, (err, result) => {
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


isp.post('/add_isp_user_now',function(req, res){
  console.log("Url " + req.url);

  ispModel.addIspUserNow(req.body.full_name, req.body.user_name, req.body.email, req.body.phone, req.body.address, req.body.designation, req.body.id_role, req.body.id_zone , req.body.pwd,req.body.id_isp, (err, result) => {
    if(err === 'error') {
      res.end(JSON.stringify({'status' : 'failed' , 'msg' : result }));
    }else if(err === 'success'){
      res.end(JSON.stringify({'status' : 'success' , 'msg' : result}));
    }else{
      res.end(JSON.stringify({'status' : 'warning' , 'msg' : result}));
    }
  });
});


 // Start ******ISP USER ROLE Section**********

isp.get('/view_isp_user_role', (req, res) => {
  console.log("Url " + req.url);
  var id_isp = req.query.id_isp;

  ispModel.getAllIspRole(id_isp, (err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
      ispModel.getIndivIsp(id_isp, (result) => {
        res.render('admin/isp_user_role_view', {
          title: 'ISP',
          message :'',
          items: rows,
          IndivIsp: result
        });
      });
    }
  });
});


isp.get('/add_isp_user_role_frm',function(req, res){
  console.log("Url " + req.url);
  var id_isp = req.query.id_isp; // grab the id_isp

  ispModel.getIndivIsp(id_isp, (rows) => {
    res.render('admin/isp_add_user_role_frm', {
      title: 'ISP',
      message :'',
      IspInfo : rows
    });
  });

});


isp.post('/add_isp_user_role_now',function(req, res){
  console.log("Url " + req.url);

  ispModel.addIspUserRoleNow(req.body.id_isp, req.body.name, req.body.desc, (err, result) => {
    // console.log(rows);
    if(err === 'error') {
      res.end(JSON.stringify({'status' : 'failed' , 'msg' : result }));
    }else if(err === 'warning'){
      res.end(JSON.stringify({'status' : 'warning' , 'msg' : result}));
    }else if(err === 'success'){
      res.end(JSON.stringify({'status' : 'success' , 'msg' : result}));
    }
  });
});
// End ******ISP USER ROLE Section**********



// Start ******ISP USER Section**********
isp.get('/view_isp_user', (req, res) => {
  console.log("Url " + req.url);
  var id_isp = req.query.id_isp;

  ispModel.getAllIspUser(id_isp, (err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
      ispModel.getIndivIsp(id_isp, (result) => {
        res.render('admin/isp_user_view', {
          title: 'ISP',
          message :'',
          items: rows,
          IndivIsp: result
        });
      });
    }
  });
});

isp.get('/add_isp_user_frm',function(req, res){
  console.log("Url " + req.url);
  var id_isp = req.query.id_isp; // grab the id_isp

  ispModel.getAllIspRole(id_isp, (err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
      console.log("Calling info isp ");
      ispModel.getIndivIsp(id_isp, (result) => {
        res.render('admin/isp_add_user_frm', {
          title: 'ISP',
          message :'',
          Roles: rows,
          IspInfo: result
        });
      });
    }
  });

});

// END ******ISP USER Section**********


module.exports = isp;
