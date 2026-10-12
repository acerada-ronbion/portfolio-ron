const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema(
    {},
    {
        strict: false,
        collection: "profile_core",
    }
)

module.exports = mongoose.model("Profile", ProfileSchema);