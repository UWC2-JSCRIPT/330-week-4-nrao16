const mongoose = require('mongoose');

const User = require('./user');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: User, index: true }
});

module.exports = mongoose.model("token", tokenSchema);