const Certificate = require("../models/Certificate");

const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find();
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCertificates };