const db = require('./dbconnect');

var Payment = {};

Payment.getAllPayment = function(callback) {
  var sql = "SELECT * FROM isp_payment LEFT JOIN isp ON isp.id_isp = isp_payment.id_isp";
  db.query(sql , function (err, result, fields) {
    if (err) {
      console.log("MySql Error!");
      callback('error', err);
    } else {
      callback('success', result);
    }
  });
}


Payment.addPaymentNow = function(id_isp, amount, callback) {
  let today = new Date().toISOString().slice(0, 10);
  console.log('Param ' + today);
  let sql = "INSERT INTO `isp_payment`(`id_isp`, `amount`, `created_at`) ";

  sql += "VALUES('"+ id_isp +"', '"+ amount +"', '"+ today +"')";
  console.log("SQL" + sql );

  db.query(sql , function (err, result, fields) {
    if (err) {
      callback('error', err);
    } else {
      sql = "UPDATE isp SET `balance` = `balance` + '"+ amount +"' WHERE id_isp='"+ id_isp +"'";
      db.query(sql, (err, res, fields) => {
        if(err) {
          // TODO: Need to delete the payment
        } else {
          callback('success', result);
        }
      });

    }
  });
}

module.exports = Payment;
