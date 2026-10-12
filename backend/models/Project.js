const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {},
    {
        strict: false,
        collection: "project_vault"
    }
);

module.exports = mongoose.model("Project", ProjectSchema);