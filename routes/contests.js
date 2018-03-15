const express = require('express');
const router = express.Router();
const models = require('../models/index');

/* list contests */
router.get('/contests', function(req, res, next) {
  return models.contest.findAll({
    where: {
      status: req.query.filter || ['created', 'active', 'finished']
    }
  })
  .then(contests => res.status(201).send(contests))
  .catch(error => res.status(400));
});

/* Create contest or game instance*/
router.post('/contests', function(req, res, next){
  var contestData = {
    name: req.body.name,
    startTime: req.body.startTime,
    drawTime: req.body.drawTime,
    status: req.body.status,
    gameId: req.body.gameId,
  };
  if(req.body.number_of_dice) {
    contestData.config = {"number_of_dice": req.body.number_of_dice };
  }
  var contest = models.contest
    .build(contestData)
    console.log(contest.validate())
  return contest.validate()
    .then(contest => res.status(201).send(contest))
    .catch(error => res.status(400).send(error));
});

module.exports = router;
