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
        if (!userId) {
            res.status(401).send('Invalid Bearer token');
        }
        else {
            console.log(`userId:${userId.toString()}`);
            req.userId = userId.toString();
            next();
        }
    }
};

module.exports = isLoggedIn;