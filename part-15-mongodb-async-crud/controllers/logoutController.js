// No More usersDB fake back end .json
// No more fsPromises() or path()
const User = require("../model/User");

const handleLogout = async (req, res) => {
    // NOTE: On client, make sure to delete the accessToken!!

    const cookies = req.cookies;
    if (!cookies?.jwt) { // If Cookies do not exist, or do not have .jwt extension
        return res.sendStatus(204); // 204: Successful (no content to erase)
    }
    const refreshToken = cookies.jwt;

    // Check if refreshToken is in the DB
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) { // If there was no cookie match / no user matched a cookie
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None" }); // For production: ", secure: true"
        return res.sendStatus(204); // 204: Successful, cookies cleared
    }

    // Getting this far means we did find the cookie in the database
    // Delete the refreshToken in the DB
    // Part-15 eliminate usersDB fake backend dev server
    // Clear entry for REFRESH_TOKEN
    foundUser.refreshToken = "";
    const result = await foundUser.save(); // Save new document to the MongoDB Collection
    console.log(result); // Not for production

    // For Production Deployment: Need 'secure: true' so it only accepts https://
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None" }); // For production: ", secure: true"
    res.sendStatus(204); // 204: Successful (cookies cleared)
}

module.exports = { handleLogout };