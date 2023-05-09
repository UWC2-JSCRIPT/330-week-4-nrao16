const isLoggedIn = (req, res, next) => {
    console.log("called isLoggedIn");
    next();
};

module.exports = isLoggedIn;