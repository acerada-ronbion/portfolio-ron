const Profile = require("../models/Profile");

const getProfile = async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile };