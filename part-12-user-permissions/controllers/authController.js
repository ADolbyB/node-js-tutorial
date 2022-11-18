const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");


// Function used in auth.js
const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ "message": "Username and Password are Required!!"});
    }
    // Check if user exists:
    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) {
        return res.sendStatus(401); // 401 unauthorized status
    }
    // If user does exist:
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // Assign the matching User/Admin Roles after logging in
        const roles = Object.values(foundUser.roles);
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
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(usersDB.users)
        );
        // httpOnly cookies are not accessible by JavaScript (for security)
        // Note that maxAge is in milliseconds, so (24 * 60 * 60 * 1000) = 1 day
        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken }); // Need to store in memory, so its lost on logout and not vulnerable

    } else {
        res.sendStatus(401); // Unauthorized (The cookie was tampered with or whatever)
    }
}

module.exports = { handleLogin };