const tokenDAO = require('../daos/token');

const isLoggedIn = async (req, res, next) => {
    console.log("called isLoggedIn");
    const reqHeader = req?.headers?.authorization;
    const bearerToken = reqHeader?.indexOf('Bearer ') != -1 ? reqHeader?.substring(reqHeader?.indexOf('Bearer ') + 7) : "";

    if (!bearerToken) {
        res.status(401).send('Bearer token required');
    } else {
        console.log(`req bearer token:${bearerToken}`);
        const userId = await tokenDAO.getUserIdFromToken(bearerToken);
        console.log(`userId:${userId}`);
        if (!userId) {
            res.status(401).send('Invalid Bearer token');
        }
        else {
            req.userId = userId;
            next();
        }
    }
};

module.exports = isLoggedIn;