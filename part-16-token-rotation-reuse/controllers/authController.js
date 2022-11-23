// Part-15: Eliminate usersDB since we have MongoDB
// Need User model instead
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Don't cry over broken path fsPromises

// Function used in auth.js
const handleLogin = async (req, res) => {
    const cookies = req.cookies; // In case there is an existing cookie
    console.log(`handleLogin Cookie: ${JSON.stringify(cookies)}`);

    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ "message": "Username and Password are Required!!"});
    }
    // Check if user exists:
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) {
        return res.sendStatus(401); // 401 unauthorized status
    }
    // If user does exist:
    // Evaluate the password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // Assign the matching User/Admin Roles after logging in
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // We can create JWT tokens here
        const accessToken = jwt.sign( // Roles only sent in accessToken
            { 
                "UserInfo": { // Separate Namespace for private JWT claims
                    "username": foundUser.username,
                    "roles": roles // Only sends numerical codes, not the string values
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10s"} // Needs to be a short period of time
        );
        const newRefreshToken = jwt.sign( // DO NOT send roles in refresh token (not needed)
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d"} // Needs to be the maximum period you desire for login
        );

        let newRefreshTokenArray = 
            !cookies?.jwt // If we do not have any cookies with .jwt extension
                ? foundUser.refreshToken // add new token to DB, no old cookies to clears
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt); // add new token, delete old one

        // If we have an old cookie: Remove it:
        if (cookies?.jwt) { // Clear the browser cookie for security purposes:
            /**
             * Scenario Added:
             * 1) User logs in but never uses RT and does not log out
             * 2) RT is stolen
             * 3) if 1 & 2, reuse detection is needed to clear all RTs when user logs in
             */
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            if (!foundToken) { // Detected refresh token reuse
                console.log("Attempted Refresh Token Reuse At Login!!")
                newRefreshTokenArray = [] // Clear ALL previous refreshTokens
            }

            res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" }); // For production: ", secure: true"
        }
        
        // Save the Refresh Token with the Current User:
        // No more usersDB, etc.
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        // httpOnly cookies are not accessible by JavaScript (for security)
        // Note that maxAge is in milliseconds, so (24 * 60 * 60 * 1000) = 1 day
        res.cookie("jwt", newRefreshToken, { httpOnly: true, secure:true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 }); // For Production: secure: true,
        
        // Send auth roles & access token to user:
        res.json({ roles, accessToken }); // Need to store in memory, so its lost on logout and not vulnerable

    } else {
        res.sendStatus(401); // Unauthorized (The cookie was tampered with or whatever)
    }
}

module.exports = { handleLogin };