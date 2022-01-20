require('dotenv').config();
const express = require('express');
const app  = express();
let https = require('https');
let fs = require('fs');
let options = {
  key: fs.readFileSync('www.unoo.kro.kr-key.pem'),
  cert: fs.readFileSync('www.unoo.kro.kr-crt.pem'),
  ca: fs.readFileSync('www.unoo.kro.kr-chain.pem'),
  requestCert: false,
  rejectUnauthorized: false,
};

//Server 연결
const server = https.Server(options, app);
server.listen(443, function () {
  console.log('success https');
});
//MongoDB 연결
const mongoose = require('mongoose');
const connect = require('./lib/db.js');
connect();


app.set('view engine', 'ejs');
app.use(express.static('public'));
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser')
let session = require('express-session')
let compression = require('compression');

app.use(express.static('public'));//app.use('요청경로',express.static(원하는실제폴더의경로));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.text());
app.use(cookieParser())
app.use(compression());
const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
let sessionMiddleWare = session({
  key: 'express.sid',
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 6000000,
  }
});
app.use(sessionMiddleWare);

const io = require('./socket.js')(server, app, sessionStore, cookieParser);
let passport = require('./lib/passport')(app);
let indexRouter = require('./routes/index')(io);
let roomRouter = require('./routes/room')(io);
let authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/room', roomRouter);
app.use('/auth', authRouter);

app.use(function (req  , res  , next ) {
  console.log(req.url);
  res.status(404).send('Sorry cant find that!');
});
let errorHandler = require('./exception/ErrorHandler');
app.use(errorHandler);

