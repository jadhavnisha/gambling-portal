const express = require('express');
const router = express.Router();
const models = require('../models/index');

router.use(function(req,res,next){
  if(req.session.isAdmin)
    return res.status(402).send("Not allowed to access this route");
  next();
})

/* POST participate in contest */
router.post('/contestant', function(req, res, next) {
  console.log(req.body);
  if(req.body.bid && req.body.contestId) {
    var contestantData = {
      bid: parseInt(req.body.bid),
      prediction: req.body.prediction,
      userId: req.session.userId,
      contestId: parseInt(req.body.contestId),
    }

    return models.contestant
      .create(contestantData)
      .then(contestant => {
        req.flash('info', 'Your bid has been placed successfully.!!');
        res.redirect('/contests/'+contestant.contestId);
      })
      .catch(error => {console.log(error); res.status(400).send(error)});
  }
});

module.exports = router;
