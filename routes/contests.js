const express = require('express');
const router = express.Router();
const models = require('../models/index');

/* list contests */
router.get('/contests', function(req, res, next) {
});

/* Create contest or game instance*/
router.post('/contests', function(req, res, next){
  console.log(req.body, new Date);
  var contestData = {
    name: req.body.name,
    startTime: req.body.startTime,
    drawTime: req.body.drawTime,
    status: req.body.status,
    gameId: req.body.gameId,
    config: req.body.config
  };

  return models.contest
    .create(contestData)
    .then(contest => res.status(201).send(contest))
    .catch(error => res.status(400).send(error));
});

module.exports = router;
