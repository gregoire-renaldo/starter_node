const Boat = require('../models/Boat.js')

exports.all = (req, res, next) => {
  Boat.find()
  .then(boats => res.render('pages/boats', {boats: boats}))
    .then(boats => res.status(200).json(boats))
    .catch(error => res.status(400).json({ error }));
};

exports.show = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(boat => res.status(200).json(boat))
    .catch(error => res.status(404).json({ error }));
};
