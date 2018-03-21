const express = require('express');
const router = express.Router();
const models = require('../models/index');

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
  if(req.session.userId)
  {
    return models.user.getById(req.session.userId)
    .then(user => {res.render('dashboard', {user: user})})
    .catch(error => res.status(400).send(error));
  }else{
    res.redirect('signin');
  }
});

router.post('/signin', function(req, res, next) {
  if (req.body.email && req.body.password) {
    return models.user.authenticate(req.body.email, req.body.password)
    .then(user => {
      req.session.userId = user.id;
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
