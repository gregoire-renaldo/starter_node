const mongoose = require('mongoose');
// validations à revoir
// intervals de date à mettre en place
const boatSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price_for_rent: { type: Number, required: true },
  // date_available: { type: String },
  // imagePath: { type: String },
  // user_id: { type: String  },
});

module.exports = mongoose.model('Boat', boatSchema);
