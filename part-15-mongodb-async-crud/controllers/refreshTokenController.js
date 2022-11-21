// No more usersDB here anymore for the .json file fake DB...we have Mongo
const User = require("../model/User");
const jwt = require("jsonwebtoken");

// Function used in auth.js
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) { // If Cookies do not exist, or do not have .jwt extension
        return res.sendStatus(401); // Unauthorized Access
    }
     // We made it this far so print the cookie value out to the console
    const refreshToken = cookies.jwt;
    console.log("handleRefreshToken:" + refreshToken);

    // This means the user does exist, so check if their stored cookie === cookies.jwt
    // Don't need the usersDB fake back end for development anymore: 
    // Use refreshToken() instead
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) { // If there was no cookie match
        return res.sendStatus(403); // 403 Forbidden
    }
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) { // If there's an error or the usernames don't match
                return res.sendStatus(403); // 403 Forbidden
            }
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles":roles // Only pass the numerical values for Admin/Editor/User
                    } 
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10m" }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken };