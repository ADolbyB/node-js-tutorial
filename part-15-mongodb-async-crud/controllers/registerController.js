// No more need for userDB: We have MongoDB
// Import User model
const User = require("../model/User");
// No need for fsPromises & path since we're using a real database
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ "message": "Username and Password are Required!!"});
    }
    // Need to check for duplicate usernames in the DB: DIFFERENT...
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.sendStatus(409); // Status 409 is a conflict
    }
    try {
        // Encrypt the password and add salt
        const hashedPwd = await bcrypt.hash(pwd, 10);
        
        // Create and Store the new user all at once: DIFFERENT...
        const result = await User.create({ // Note changes in authController.js
            "username": user,
            // "roles": default values are in place:
            // All new users get lowest credentials
            "password": hashedPwd
        });
        // no await fsPromises or JSON.stringify(usersDB.users)
        // since we are using MongoDB instead
        console.log(result);
        console.log({"success": `New User ${user} Has Been Created!!`});
        res.status(201).json({ "success": `New User ${user} Has Been Created!!`});
    } catch {
        res.status(500).json({ "message": err.message });
    }
}

module.exports = { handleNewUser };