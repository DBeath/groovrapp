var express = require('express');
var hbs = require('hbs');
var morgan = require('morgan');
var Reg = require('./models/registrations');
var validator = require('validator');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport.js').passport;
var roles = require('./config/roles.js').user;
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorhandler = require('errorhandler');

var app = module.exports = express();
var config = require('./config/');

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());

var cookiesecret = null;
if (config.cookiesecret) {
  cookiesecret = config.cookiesecret;
};
app.use(cookieParser(cookiesecret));

var sessionsecret = 'notsuchagoodsecret';
if (config.sessionsecret) {
  sessionsecret = config.sessionsecret;
  console.log('Session secret: ' + sessionsecret);
};
app.use(session({ 
  secret: sessionsecret
  //cookie: { maxAge: 60000 }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.enable('trust proxy');
app.use(errorhandler());

var isLoggedIn = function (req, res, next) {
  console.log(req.session);
  if (req.isAuthenticated()) {
    return next();
  };
  req.session.returnTo = req.originalUrl || req.url;
  res.redirect('/login');
};

// Routes
app.post('/login', passport.authenticate('local-login', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/login', function (req, res) {
  res.render('login', { 
    message: req.flash('message')
    //layout: 'login_layout' 
  });
});

// show the signup form
app.get('/signup', function (req, res) {
  // render the page and pass in any flash data if it exists
  res.render('signup', { 
    message: req.flash('signupMessage')
    //layout: 'login_layout' 
  });
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


app.get('/', function (req, res) {
  res.render('index.html', {
    title: 'Groovr'
  });
});

// app.post('/', function (req, res, next) {
//   if (!req.param('email')) {
//     console.log('no email');
//     return res.redirect('/');
//   };

//   if (!validator.isEmail(req.param('email'))) {
//     console.log('not an email address');
//     return res.redirect('/');
//   } else {
//     var email = req.param('email');
//     var reg = new Reg();
//     reg.email = email;
//     reg.save(function (err) {
//       if (err) {
//         console.log(email + 'is already registered');
//       }
//       console.log('Registered ' + email);
//       req.flash('message', 'You have registered ' + email);
//       return res.redirect('/', {
//         message: req.flash('message')
//       });
//     });
//   }; 
// });

// app.use('/', roles.can('access games'));
app.get('/registered', roles.can('access games'), function (req, res, next) {
  res.render('registered', {});
});

mongoose.connect(config.dbstring, function (err) {
  app.listen(config.port);
});