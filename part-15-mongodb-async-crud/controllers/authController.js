// Part-15: Eliminate usersDB since we have MongoDB
// Need User model instead
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Don't cry over broken path fsPromises

// Function used in auth.js
const handleLogin = async (req, res) => {
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
            { expiresIn: "10m"} // Needs to be a short period of time
        );
        const refreshToken = jwt.sign( // DO NOT send roles in refresh token (not needed)
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d"} // Needs to be the maximum period you desire for login
        );
        // Save the Refresh Token with the Current User:
        // No more usersDB, etc.
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        // httpOnly cookies are not accessible by JavaScript (for security)
        // Note that maxAge is in milliseconds, so (24 * 60 * 60 * 1000) = 1 day
        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 }); // For Production: secure: true,
        
        // Send auth roles & access token to user:
        res.json({ roles, accessToken }); // Need to store in memory, so its lost on logout and not vulnerable

    } else {
        res.sendStatus(401); // Unauthorized (The cookie was tampered with or whatever)
    }
}

module.exports = { handleLogin };