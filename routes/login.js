const { Router } = require("express");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');
const isLoggedIn = require('./auth');

// signup
router.post("/signup", async (req, res, next) => {
    const user = req.body;
    if (!user || JSON.stringify(user) === '{}' || !user.email || !user.password) {
        res.status(400).send('user email and password are required');
    } else {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 4);
            console.log(`password:${user.password}, hashedPassword:${hashedPassword.toString()}`)
            const saveduser = await userDAO.createUser({ email: user.email, password: hashedPassword.toString() });
            res.json(saveduser.email);
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
});

// login
router.post("/", async (req, res, next) => {
    const user = req.body;
    if (!user || JSON.stringify(user) === '{}' || !user.email || !user.password) {
        res.status(400).send('user email and password required');
    } else {
        try {
            const saveduser = await userDAO.getUser(user.email);
            const isPasswordMatch = await bcrypt.compare(user.password, saveduser.password);
            console.log(`isPasswordMatch:${isPasswordMatch}`);

            if (isPasswordMatch) {
                const created = await tokenDAO.makeTokenForUserId(saveduser.userId);
                console.log(`token:${created.token}}`);
                res.json({ token: created.token });
            } else {
                res.status(401).send('Invalid password');
            }
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
});

// password
router.post("/password", isLoggedIn, async (req, res, next) => {
    const user = req.body;
    if (!user || JSON.stringify(user) === '{}' || !user.userId || !user.password) {
        res.status(400).send('password is required');
    } else {
        try {
            const saveduser = await userDAO.updateUserPassword(user.userId, user.password);
            res.json(saveduser);
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
});

router.post("/logout", isLoggedIn, async (req, res, next) => {
    const user = req.body;
    if (!user || JSON.stringify(user) === '{}') {
        res.status(400).send('user is required');
    } else {
        try {
            
            res.status(200).send();
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
});

module.exports = router;


