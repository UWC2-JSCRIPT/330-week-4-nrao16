const { Router } = require("express");
const router = Router();

const userDAO = require('../daos/user');
const isLoggedIn = require('./auth');

// signup
router.post("/signup", async (req, res, next) => {
    const user = req.body;
    if (!user || JSON.stringify(user) === '{}' || !user.email || !user.password) {
      res.status(400).send('user email and password are required');
    } else {
      try {
        const saveduser = await userDAO.createUser(user);
        res.json(saveduser); 
      } catch(e) {
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
        // TODO
        // compare savedUser stored password with user.password
        res.json(saveduser); 
      } catch(e) {
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
      } catch(e) {
        res.status(500).send(e.message);
      }
    }
  });

  router.post("/logout", isLoggedIn, async (req, res, next) => {
    const user = req.body;
    if (!user || JSON.stringify(user) === '{}' ) {
      res.status(400).send('user is required');
    } else {
      try {
        //TODO - 
        // call removeToken(tokenString)
       res.status(200).send();
      } catch(e) {
        res.status(500).send(e.message);
      }
    }
  });

  module.exports = router;
  

