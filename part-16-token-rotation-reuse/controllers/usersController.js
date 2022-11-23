const User = require("../model/User");

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) {
        return res.status(204).json({ "message": "Get All: No Users found in DB!"});
    }
    res.status(200).json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": "Delete: User ID is REQUIRED!"});
    }

    const user = await User.findOne({ _id: req.body.id }).exec();
    if(!user) {
        return res.status(204).json({ "message": `User ID ${req.body.id} Not Found!`});
    }

    const result = await user.deleteOne(); // { _id: req.body.id }
    res.status(200).json(result);
}   

const getUser = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": "Get: User ID is REQUIRED!"})
    }
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ "message": `User ID ${req.params.id} Not Found!`})
    }
    res.status(200).json(user); // All good, display the user
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser
}