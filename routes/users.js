const express = require('express');
const router = express.Router();
const models = require('../models/index');

/* GET users listing. */
router.post('/', function(req, res, next) {
	// if (req.body.email &&
 //    req.body.password &&
 //    req.body.firstName &&
 //    req.body.lastName &&
 //    req.body.publicKey) {

    var userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      publicKey: req.body.publicKey,
    }


    return models.user
      .create(userData)
      .then(user => res.status(201).send(user))
      .catch(error => { res.status(400).send(error.errors[0].message);});
  // }
});

module.exports = router;
