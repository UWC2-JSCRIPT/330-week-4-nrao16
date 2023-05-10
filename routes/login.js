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
            const userExists = await userDAO.getUser(user.email);
            if (userExists) {
                res.status(409).send('User email already signed up.')
            } else {
                const hashedPassword = await bcrypt.hash(user.password, 4);
                console.log(`password:${user.password}, hashedPassword:${hashedPassword.toString()}`)
                await userDAO.createUser({ email: user.email, password: hashedPassword.toString() });
                res.status(200).send(`Signed up user email ${user.email}`);
            }
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
                console.log(`saveduser.userId:${saveduser._id}`);
                const created = await tokenDAO.makeTokenForUserId(saveduser._id);
                console.log(`token:${created.token}}`);
                res.json({ token: created.token });
            } else {
                res.status(401).send('Invalid password');
            }
        } catch (e) {
            res.status(401).send(e.message);
        }
    }
});

// password
router.post("/password", isLoggedIn, async (req, res, next) => {
    const user = req.body;
    if (!user.password) {
        res.status(400).send('password is required');
    } else {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 4);
            console.log(`password:${user.password}, hashedPassword:${hashedPassword.toString()}`)
            await userDAO.updateUserPassword(req.userId, hashedPassword.toString());
            res.status(200).send('Password updated');
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
});

router.post("/logout", isLoggedIn, async (req, res, next) => {
    try {
        const reqHeader = req?.headers?.authorization;
        await tokenDAO.removeToken(reqHeader?.substring(reqHeader?.indexOf('Bearer ') + 7))
        res.status(200).send('Logged out');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;


