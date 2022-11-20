const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) { // Improper Token: Auth Header Token starts with "Bearer "
        return res.sendStatus(401); // 401 Forbidden w/o authentication
    }
    console.log("JWT Verified: \n");
    console.log(authHeader); // Displays Bearer (token id)
    const token = authHeader.split(" ")[1];
    jwt.verify( // after we decode the jwt: need to set user/admin rolesz
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) { // if we have an invalid token
                return res.sendStatus(403); // 403 Forbidden Status (invalid token)
            }
            // if not an error:
            req.user = decoded.UserInfo.username; // Use updated corrected Namespaces
            req.roles = decoded.UserInfo.roles; // Use updated corrected Namepaces
            next();
        }
    );
}

module.exports = verifyJWT;