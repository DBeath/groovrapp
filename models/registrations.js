var mongoose = require('mongoose');

var regSchema = mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  firstname: { type: String },
  lastname: { type: String },
  registered: { type: Date, default: Date.now }
});

module.exports = mongoose.model('reg', regSchema);