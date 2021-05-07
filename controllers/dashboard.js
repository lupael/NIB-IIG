const express = require('express');

const dashboard = express.Router();


dashboard.get('/',function(req,res){
  console.log(users_id);
  console.log("Url " + req.url);
  res.render('admin/dashboard', {
    title: 'Dashboard'
  });
});


module.exports = dashboard;
