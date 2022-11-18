const whiteList = require("../config/whiteList");

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (whiteList.includes(origin)) {
        // Bugfix: This is what CORS is looking for:
        res.header("Access-Control-Allow-Credentials", true);
    }
    next();
}

module.exports = credentials;