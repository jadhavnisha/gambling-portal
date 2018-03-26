const express = require('express');
const router = express.Router();
const models = require('../models/index');
var fakeGames = [{name: 'Black-Jack'}, {name: 'Poker'}];

/* POST create user */
router.post('/signup', function(req, res, next) {
  var userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  }

  return models.user
    .create(userData)
    //.then(user => res.status(201).send(user))
    .then(user => {
      req.flash('info', 'Signed up successfuly, use your credetials to signin.');
      res.render('signin');})
    .catch(error => {
      req.flash('info', error.errors[0].message);
      res.render('signup');
      // res.status(400).send(error)
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
      res.redirect('dashboard');
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
