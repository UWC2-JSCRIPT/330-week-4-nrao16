const tokenDAO = require('../daos/token');

// middleware function to check for valid bearer token
const isLoggedIn = async (req, res, next) => {
    const reqHeader = req?.headers?.authorization;
    const bearerToken = reqHeader?.indexOf('Bearer ') != -1 ? reqHeader?.substring(reqHeader?.indexOf('Bearer ') + 7) : "";

    if (!bearerToken) {
        res.status(401).send('Bearer token required');
    } else {
        const userId = await tokenDAO.getUserIdFromToken(bearerToken);
        if (!userId) {
            res.status(401).send('Invalid Bearer token');
        }
        else {
            req.userId = userId.toString();
            next();
        }
    }
};

module.exports = isLoggedIn;