const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
    {},
    {
        strict: false,
        collection: "link_vault"
    }
);

module.exports = mongoose.model("Link", LinkSchema);