const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "credential_vault"
  }
);

module.exports = mongoose.model("Certificate", CertificateSchema);