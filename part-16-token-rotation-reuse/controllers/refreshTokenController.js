// No more usersDB here anymore for the .json file fake DB...we have Mongo
const User = require("../model/User");
const jwt = require("jsonwebtoken");

// Function used in auth.js
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) { // If Cookies do not exist, or do not have .jwt extension
        return res.sendStatus(401); // Unauthorized Access du to no cookies
    }
     // We made it this far so print the cookie value out to the console
    const refreshToken = cookies.jwt;
    console.log("handleRefreshToken: ");
    console.log(refreshToken);

    // Clear Cookie in browser after we get the data
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" }); // For production: ", secure: true"

    // This means the user does exist, so check if their stored cookie === cookies.jwt
    // Don't need the usersDB fake back end for development anymore: 
    // Use refreshToken() instead
    const foundUser = await User.findOne({ refreshToken }).exec(); // Still works with an array of strings

    // If a previously used refreshToken is Reused: Detect Here:
    // This only happens if a cookie was received,
    // But it was not already associated with a user, so its INVALID
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) { // Cookie has already expired
                    return res.sendStatus(403);
                }
                console.log("Attempted Refresh Token Reuse!!")
                const hackedUser = await User.findOne({ username: decoded.username }).exec();
                hackedUser.refreshToken = [];   // Clear all refreshTokens in compromised account
                const result = await hackedUser.save();
                console.log("Bad Cookie: " + result); // Should print any tokens that were deleted.
            }
        )
        return res.sendStatus(403); // 403 Forbidden (This line may be erroneous)
    }

    // Create a new Refresh Token Array without the old Refresh Token.
    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // Evaluate a valid JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) { // We received a token w/ valid user, but token has expired & neds replacement:
                console.log("Expired Refresh Token");
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result);
            }
            if (err || foundUser.username !== decoded.username) { // If there's an error or the usernames don't match
                return res.sendStatus(403); // 403 Forbidden
            }

            // At this point the refreshToken is still valid:
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles":roles // Only pass the numerical values for Admin/Editor/User
                    } 
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10s" }
            );

            const newRefreshToken = jwt.sign( // DO NOT send roles in refresh token (not needed)
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d"} // Needs to be the maximum period you desire for login
            );
            // Save the Refresh Token with the Current User:
            // Data Being returned to the DB: 
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();
            console.log(result);
            
            // httpOnly cookies are not accessible by JavaScript (for security)
            // Note that maxAge is in milliseconds, so (24 * 60 * 60 * 1000) = 1 day
            res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 }); // For Production: secure: true,

            res.json({ roles, accessToken })
        }
    );
}

module.exports = { handleRefreshToken };