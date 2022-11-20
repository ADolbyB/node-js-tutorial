const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}

const jwt = require("jsonwebtoken");

// Function used in auth.js
const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) { // If Cookies do not exist, or do not have .jwt extension
        return res.sendStatus(401); // Unauthorized Access
    }
    console.log("Refresh Token Issued: ")
    console.log(cookies.jwt); // We made it this far so print the cookie value out to the console
    const refreshToken = cookies.jwt;

    // This means the user does exist, so check if their stored cookie === cookies.jwt
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
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