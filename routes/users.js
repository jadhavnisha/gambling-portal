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
    .then(user => res.render('signin'))
    .catch(error => res.status(400).send(error));
});

/* render signup form */
router.get('/signup', function(req, res, next) {
  if(req.session.userId)
  {
    res.redirect('dashboard');
  }else{
    res.render('signup');
  }
});

/* render signin form */
router.get('/signin', function(req, res, next) {
  if(req.session.userId)
  {
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
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
      res.redirect('dashboard');
    })
    .catch(error => {
      console.log(error);
      res.status(404).send('Wrong email/password');
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
