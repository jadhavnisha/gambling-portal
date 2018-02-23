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
    .then(user => res.status(201).send(user))
    .catch(error => res.status(400).send(error));
});

router.post('/signin', function(req, res, next) {
  console.log('login');
  if (req.body.email && req.body.password) {
    
    return models.user.authenticate(req.body.email, req.body.password)
    .then(user => {
        // req.session.userId = user.id;
        return res.status(201).send(user);        
    })
    .catch(error => {
      console.log(error);
      res.status(404).send('Wrong email/password');
    });
  }
})

module.exports = router;
