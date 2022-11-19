const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require("fs").promises; // Only need this because we arent using a real DB
const path = require("path");

const handleLogout = async (req, res) => {
    // NOTE: On client, make sure to delete the accessToken!!

    const cookies = req.cookies;
    if (!cookies?.jwt) { // If Cookies do not exist, or do not have .jwt extension
        return res.sendStatus(204); // 204: Successful (no content to erase)
    }
    const refreshToken = cookies.jwt;

    // Check if refreshToken is in the DB
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) { // If there was no cookie match / no user matched a cookie
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        return res.sendStatus(204); // 204: Successful, cookies cleared
    }

    // Getting this far means we did find the cookie in the database
    // Delete the refreshToken in the DB
    // remember we are using a file and not a real DB in this example
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser, refreshToken);
    const currentUser = {...foundUser, refreshToken: ""}; // insert empty string to clear cookie from DB
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(usersDB.users)
    );

    // For Production Deployment: Need 'secure: true' so it only accepts https://
    // since we are only using a .json file in development, we don't want that.
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204); // 204: Successful (cookies cleared)
}

module.exports = { handleLogout };