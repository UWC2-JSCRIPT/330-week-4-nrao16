const mongoose = require('mongoose');
const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
    return Note.create({ userId: userId, ...noteObj });
}

module.exports.getNote = async (userId, noteId) => {
    return Note.findOne({ userId: userId, _id: new mongoose.Types.ObjectId(noteId)}).lean();
}

module.exports.getUserNotes = async (userId) => {
    return Note.find({ userId: userId}).lean();
}