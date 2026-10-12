const express = require("express");
const router = express.Router();

const { getCertificates } = require("../controllers/certificateController");

router.get("/", getCertificates);

module.exports = router;