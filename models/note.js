const mongoose = require('mongoose');

const User = require('./user');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: String, ref: User, index: true }
});


module.exports = mongoose.model("notes", noteSchema);