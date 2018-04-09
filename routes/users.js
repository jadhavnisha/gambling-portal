const express = require('express');
const router = express.Router();
const models = require('../models/index');
var fakeGames = [{name: 'Black-Jack'}, {name: 'Poker'}];
var fs = require('fs');
var path = require('path');

router.get('/download', function(req, res, next){
  var filename = path.join(__dirname, '../tmp/privateKey');
  var stream = fs.createReadStream(filename);
  stream.pipe(res).once("close", function () {
      stream.destroy(); // makesure stream closed, not close if download aborted.
      // deleteFile(filename);
      fs.unlink(filename, function (err) {
        if (err) {
            console.error(err.toString());
        } else {
            console.warn(filename + ' deleted');
        }
    });
  });
  res.download(filename);
})

/* POST create user */
router.post('/signup', function(req, res, next) {
  var userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    chainPassword: req.body.chainPassword
  }

  return models.user
    .create(userData)
    .then(user => {
      req.flash('info', 'Signed up successfuly..!!');
      setTimeout(function(){
        res.redirect('/signin');
      },200);
    })
    .catch(error => {
      req.flash('info', error.errors[0].message);
      res.render('signup');
    });
});

/* render signup form */
router.get('/signup', function(req, res, next) {
  if(req.session.userId)
  {
    req.flash('info', 'You are already signed in, please logout and sign up.');
    res.redirect('dashboard');
  }else{
    res.render('signup');
  }
});

/* render signin form */
router.get('/signin', function(req, res, next) {
  if(req.session.userId)
  {
    req.flash('info', 'You are already signed in.');
    res.redirect('dashboard');
  }else{
    res.render('signin');
  }
});

router.get('/dashboard', function(req, res, next) {
  var user = models.user.getById(req.session.userId);
  var games = user.then(user => {
    return models.game.findAll();
  })

  return Promise.all([user, games])
  .then(([user, games]) => {
    if(games.length < 2){
      games.push.apply(games, fakeGames);
    }
    res.render('dashboard', {user: user, games: games})
  })
  .catch(error => res.status(400).send(error));
});

router.post('/signin', function(req, res, next) {
  if (req.body.email && req.body.password) {
    return models.user.authenticate(req.body.email, req.body.password)
    .then(user => {
      req.flash('info', 'Signed in successfuly.!!!');
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
      req.session.userBalance = user.balance;
      req.session.userName = user.firstName + ' ' + user.lastName;
      req.session.save();
      if(req.session.userId) return;
    })
    .then(user => {
      setTimeout(function(){
        res.redirect('dashboard');
      }, 10);
    })
    .catch(error => {
      console.log(error);
      req.flash('info', 'Wrong credetials, please re-enter correct email & password.');      
      res.render('signin');
    });
  }
})

// GET for signout signout
router.get('/signout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        res.redirect('signin');
      }
    });
  }
});

module.exports = router;
