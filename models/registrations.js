var mongoose = require('mongoose');

var regSchema = mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  registered: { type: Date, default: Date.now }
});

module.exports = mongoose.model('reg', regSchema);