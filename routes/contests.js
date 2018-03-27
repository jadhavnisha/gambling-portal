const express = require('express');
const router = express.Router();
const models = require('../models/index');
const contestService = require('../services/contest_service');

/* list contests */
router.get('/contests', function(req, res, next) {
  var whereCondition = { status: req.query.filter || ['created', 'active', 'finished'] };
  if(req.query.gameId)
    whereCondition['gameId'] = parseInt(req.query.gameId);
  return models.contest.findAll({
    where: whereCondition
  })
  .then(contests => res.render('contests', {contests: contests, user: req.user}))
  .catch(error => res.status(400));
});

/* render contest creation form */
router.get('/admin/contests/create', function(req, res, next) {
  return res.render('admin/contests/create', {user: req.user});
});

/* Create contest or game instance*/
router.post('/admin/contests', function(req, res, next){
  var contestData = {
    name: req.body.name,
    status: req.body.status,
    gameId: req.body.gameId,
  };
  if(req.body.number_of_dice) {
    contestData.config = {"number_of_dice": req.body.number_of_dice };
  }
  var contest = models.contest
    .create(contestData)
    .then(contest => res.status(201).send(contest))
    .catch(error => res.status(400).send(error));
});

router.put('/admin/contests/:id/start', function(req, res, next) {
  return contestService.start(req.params.id)
  .then(contest => res.status(201).send(contest))
  .catch(err => next(err))
});

router.put('/admin/contests/:id/draw', function(req, res, next) {
  return contestService.draw(req.params.id)
  .then(contest => {res.status(201).send(contest)})
  .catch(err => next(err))
});

module.exports = router;
