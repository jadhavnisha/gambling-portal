const express = require('express');
const router = express.Router();
const models = require('../models/index');

/* list games */
router.get('/games', function(req, res, next) {
  return models.game.findAll()
  .then(games => res.status(201).send(games))
  .catch(error => res.status(400));
});


module.exports = router;