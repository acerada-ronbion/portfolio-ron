const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "document_vault"
  }
);

module.exports = mongoose.model("Document", DocumentSchema);