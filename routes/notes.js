const { Router } = require("express");
const router = Router();

const noteDAO = require('../daos/note');
const isLoggedIn = require('./auth');

router.use(isLoggedIn);

// create a note for user id
router.post("/", async (req, res, next) => {
    try {
        const notes = req.body;
        if (!notes || JSON.stringify(notes) === '{}' || !notes.text) {
            res.status(400).send('Note text is required');
        } else {
            const savedNote = await noteDAO.createNote(req.userId, notes)
            res.json(savedNote);
        }
    } catch (e) {
        next(e);
    }
});

// Read - all notes for given userId
router.get("/", async (req, res, next) => {
    try {
        let notes = [];
        notes = await noteDAO.getUserNotes(req.userId);
        res.json(notes);
    } catch (e) {
        next(e);
    }
});

// Read - single note for given user id and note id
router.get("/:id", async (req, res, next) => {
    try {
        const note = await noteDAO.getNote(req.userId, req.params.id);
        if (note) {
            res.json(note);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;