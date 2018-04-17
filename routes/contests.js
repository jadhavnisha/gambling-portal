const express = require('express');
const router = express.Router();
const models = require('../models/index');
const contestService = require('../services/contest_service');

/*
Fetch all the contests,including its associated users and contestants
*/
router.get('/contests', function(req, res, next) {
  return models.contest.findAll({
    include: [{
      model: models.user,
    }],
    where: {gameId: 1},
  })
  .then(contests => {
    res.render('contests/index', {contests: contests, user: req.user})
  })
  .catch(error => {console.log(error);return res.status(400).send(error)});
});

/* render contest creation form */
router.get('/admin/contests/create', function(req, res, next) {
  return res.render('admin/contests/create', {user: req.user});
});

router.get('/contests/:id', function(req, res, next) {
  return models.contest.findOne({
    include: [{
      model: models.user,
    }],
    where: {id: parseInt(req.params.id)}
  })
  .then(contestWithContestants =>
    res.render('contests/show', {user: req.user, contest: contestWithContestants}))
  .catch(error => res.status(400).send(error));
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
    .then(contest => res.redirect('/contests'))
    .catch(error => res.status(400).send(error));
});

router.put('/admin/contests/:id/start', function(req, res, next) {
  contestService.start(req.params.id)
  .then(contest => res.status(201).send(contest))
  .catch(err => next(err))
});

router.put('/admin/contests/:id/draw', function(req, res, next) {
  contestService.draw(req.params.id)
  .then(contest => {res.status(201).send(contest)})
  .catch(err => next(err))
});

module.exports = router;
