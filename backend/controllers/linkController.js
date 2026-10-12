const Link = require("../models/Link");

const getLinks = async (req, res) => {
    try {
        const links = await Link.find();
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLinks };