const express = require('express');
const router = express.Router();
const models = require('../models/index');
const contestService = require('../services/contest_service');

router.use(function(req, res, next) {
  if (req.session.userId)
      return next();
  res.send('Please login');
});


onlyAdmin = function(req, res, next) {
  if (req.session.isAdmin)
      return next();
  res.send('ur not admin');
}
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
router.post('/contests', onlyAdmin, function(req, res, next){
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

router.put('/contests/:id/start', onlyAdmin, function(req, res, next) {
  return contestService.start(req.params.id)
  .then(contest => res.status(201).send(contest))
  .catch(err => next(err))
});

router.put('/contests/:id/draw', onlyAdmin, function(req, res, next) {
  return contestService.draw(req.params.id)
  .then(contest => {res.status(201).send(contest)})
  .catch(err => next(err))
});

module.exports = router;
