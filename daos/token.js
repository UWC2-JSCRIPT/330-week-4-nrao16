
const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid')

module.exports = {};

module.exports.getUserIdFromToken = async (tokenString) => {
    const token = await Token.findOne({ token: tokenString }).lean();
    return token?.userId;
}

module.exports.removeToken = async (tokenString) => {
    await Token.deleteOne({ token: tokenString });
    return true;
}

module.exports.makeTokenForUserId = async (userId) => {
    try {
        const uuidToken = uuidv4();
        const created = await Token.create({ token: uuidToken, userId: userId });
        console.log(`created-${created}`);
        return created;
    } catch (e) {
        if (e.message.includes('validation failed') || e.message.includes('dup key')) {
            throw new BadDataError(e.message);
        }
        throw e;
    }
}

class BadDataError extends Error { };
module.exports.BadDataError = BadDataError;