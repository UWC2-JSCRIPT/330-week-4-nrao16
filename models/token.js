const mongoose = require('mongoose');

const User = require('./user');

const tokenSchema = new mongoose.Schema({
  token: { type: String, ref: User, required: true },
  userId: { type: String, index: true }
});


module.exports = mongoose.model("token", tokenSchema);