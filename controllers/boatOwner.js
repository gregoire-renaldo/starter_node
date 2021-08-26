const Boat = require('../models/Boat.js')

// controller for authentified users, to create a boat

exports.create = (req, res, next) => {
  // to test enlever ce delete
  delete req.body._id;
  const boat = new Boat({
    ...req.body
  });
  boat.save()
    .then(() => res.status(201).json({ message: 'Boat enregistré !' }))
    .catch(error => res.status(400).json({ error }))
};
