var express = require('express');
var hbs = require('hbs');
var morgan = require('morgan');
var Reg = require('./models/registrations');
var validator = require('validator');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = module.exports = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
  res.render('index.html', {
    title: 'Groovr'
  });
});

app.post('/', function (req, res, next) {
  if (!req.param('email')) {
    console.log('no email');
    return res.redirect('/');
  };

  if (!validator.isEmail(req.param('email'))) {
    console.log('not an email address');
    return res.redirect('/');
  } else {
    var email = req.param('email');
    var reg = new Reg();
    reg.email = email;
    reg.save(function (err) {
      if (err) {
        console.log(email + 'is already registered');
      }
      console.log('Registered ' + email);
      res.redirect('/registered');
    });
  }; 
});

app.get('/registered', function (req, res, next) {
  res.render('registered', {});
});

mongoose.connect('mongodb://localhost:27017/groovr', function (err) {
  app.listen(3000);
});