const ip          = require('ip');
const path        = require('path');
const express     = require("express");
const bodyParser  = require("body-parser");
const config      = require('./configs/config');
var session       = require('express-session');


const app     = express();
var server    = require('http').Server(app);
var io        = require('socket.io')(server);

// configuring app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


// middleware of the app
app.use(session({resave: false, saveUninitialized: false, secret: 'QSA', cookie: { maxAge: 6000000 }}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


app.use(express.static(path.join(__dirname, 'assets')));
app.use("/nscripts", express.static(path.join(__dirname, 'node_modules')));

app.use(function(req, res, next) {
  if(req.session.id_iig_user){
    res.locals.id_iig_user = req.session.id_iig_user;
  }else{
    res.locals.id_iig_user = 1000000000;
  }
  next();
});

app.use(function(req, res, next) {
  if(req.session.username){
    res.locals.username = req.session.username;
  }else{
    res.locals.username = 'NULL';
  }
  next();
});


connections = [];
ips = [];
users_name = [];
users_id = [];

io.on('connection', function (socket) {

  console.log(socket.id);

  // console.log(socket);

  const clientIpAddress = socket.request.connection.remoteAddress;


  // if(!ips.includes(clientIpAddress)){
    connections.push(socket);
    ips.push(clientIpAddress);
  // }

  var  count = {};
  ips.forEach(function(i) { count[i] = (count[i]||0) + 1;});
  console.log(count);

  console.log('New connection from ' + clientIpAddress );

  console.log('Connected : %s user connected ', connections.length);


  socket.on('disconnect',function(data){

    // if(!ips.includes(clientIpAddress)){
      connections.splice(connections.indexOf(socket),1);
      ips.splice(ips.indexOf(clientIpAddress),1);
    // }
    console.log('Disconnected: %s user connected ',connections.length);
  });

  console.log(users_id);

});


// Routing of the app
app.use(require('./controllers/login'));
app.use("/login", require('./controllers/login'));
app.use("/dashboard", require('./controllers/dashboard'));
app.use('/user', require('./controllers/user'));
app.use('/isp', require('./controllers/isp'));
app.use('/payment', require('./controllers/payment'));

// listening server
server.listen(config.nibiig.port, config.nibiig.host, function() {
  console.log('Server running at http://' + ip.address() + ':' + config.nibiig.port + '/');
});
