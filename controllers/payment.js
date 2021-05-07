const express = require('express');
var session = require('express-session');
const paymentModel = require('../models/payment_model');
const ispModel = require('../models/isp_model');
const config      = require('../configs/config');
const payment = express.Router();
const request = require('request');


payment.get('/',function(req,res){
  console.log("Url " + req.url);

  paymentModel.getAllPayment((err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
      if(err === 'success'){
        res.render('admin/payment_view', {
          title: 'Payment',
          message :'',
          items: rows
        });
      }
    }
  });
});


payment.get('/add_payment_frm',function(req, res){
  console.log("Url " + req.query.id_isp);

  ispModel.getIspInfo(req.query.id_isp, (err, rows) => {
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
        res.render('admin/payment_add_frm', {
          title: 'Payment',
          message :'',
          results: rows
        });
    }
  });

});

payment.get('/withdraw_payment_frm',function(req, res){
  console.log("Url " + req.query.id_isp);

  ispModel.getIspInfo(req.query.id_isp, (err, rows) => {
    if(err === 'error') {
      res.render('error', {
        title: 'NIBFlix'
      });
    } else {
        res.render('admin/payment_withdraw_frm', {
          title: 'Payment',
          message :'',
          results: rows
        });
    }
  });

});

payment.post('/add_payment_now',function(req, res){
  console.log("Url " + req.url);

  paymentModel.addPaymentNow(req.body.id_isp, req.body.amount, (err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.end(JSON.stringify({'status' : 'failed' , 'msg' : 'Failed to add payment' }));
    }else{
      res.end(JSON.stringify({'status' : 'passed' , 'msg' : 'Successfully added payment.'}));
    }
  });

});


payment.post('/withdraw_payment_now',function(req, res){
  console.log("Url " + req.url);

  paymentModel.addPaymentNow(req.body.id_isp, (req.body.amount * -1.0), (err, rows) => {
    // console.log(rows);
    if(err === 'error') {
      res.end(JSON.stringify({'status' : 'failed' , 'msg' : 'Failed to withdraw payment' }));
    }else{
      res.end(JSON.stringify({'status' : 'passed' , 'msg' : 'Successfully withdraw payment.'}));
    }
  });

});

module.exports = payment;
