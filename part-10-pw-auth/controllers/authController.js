const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require("bcrypt");

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
        // We can create JWT tokens here
        res.json({ "Success": `User ${user} Is Now Logged In!!`});
    } else {
        res.sendStatus(401); // Unauthorized
    }
}

module.exports = { handleLogin };