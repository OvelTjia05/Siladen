const express = require("express");
const router = express.Router();
const { getAllJenisPasien, postJenisPasien } = require("./controller");
const VerifyTokenAdmin = require("../../middleware/VerifyTokenAdmin");

router.get("/jenis_pasien", getAllJenisPasien);
router.post("/jenis_pasien", VerifyTokenAdmin, postJenisPasien);

module.exports = router;
