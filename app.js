var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var mongoose = require('./config/db.js'); 
var passport = require('./middleware/passport.js');
var expressJwtAuth = require('./middleware/jwtAuth.js'); 

/* Configuration */
var port = process.env.PORT || 3000;

/* To parse URL encoded data */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/* To use morgan to log requests to the console */
app.use(morgan('dev'));

/* To use passport(handles login) */
app.use(passport.initialize());

/* Statics */
app.use('/images', express.static(__dirname + '/writable'));

/* Routes */
var User = require('./routes/user.js');
var Book = require('./routes/book.js');
var Post = require('./routes/post.js');
var Auth = require('./routes/auth.js');

/* Protect Routes */
app.use(/^\/(?!api\/auth).*$/, expressJwtAuth);

/* Use routes */
app.use('/api', User);
app.use('/api', Book);
app.use('/api', Post);
app.use('/api', Auth);
	
/* An error handling middleware */
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({success: false, message: err.message });
});


app.listen(port, function () {
  console.log('Listening on port', port);
});

module.exports = app;
