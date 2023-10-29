const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getAllLaporan,
  getLaporanByIdLaporan,
  getLaporanByUserId,
  getLatestThreeLaporanByUserId,
  getLaporanToday,
  getLaporanCurrentMonth,
  getLaporanAmount,
  getAmountLaporanByUserId,
  postLaporanByUser,
  postLaporanByAnonim,
  updateStatusLaporanInvestigasi,
  updateStatusLaporanSelesai,
} = require("./controller");

const VerifyTokenAdmin = require("../../middleware/VerifyTokenAdmin");
const VerifyTokenUser = require("../../middleware/VerifyTokenUser");

const upload = multer({ dest: "public/images" });

router.get("/laporan", VerifyTokenAdmin, getAllLaporan);
router.get("/laporan/current/day", VerifyTokenAdmin, getLaporanToday);
router.get("/laporan/current/month", VerifyTokenAdmin, getLaporanCurrentMonth);
router.get("/laporan/amount", VerifyTokenAdmin, getLaporanAmount);
router.get("/laporan/amount/user/:id_user", VerifyTokenUser, getAmountLaporanByUserId);

router.get("/laporan/detail/:id_laporan", VerifyTokenUser, getLaporanByIdLaporan);
router.get("/laporan/user/:id_user", VerifyTokenUser, getLaporanByUserId);
router.get("/laporan/user/latest/:id_user", VerifyTokenUser, getLatestThreeLaporanByUserId);

router.post("/laporan/user/:id_user", upload.single("gambar"), VerifyTokenUser, postLaporanByUser);
router.post("/laporan/anonim", upload.single("gambar"), postLaporanByAnonim);

router.patch("/laporan/status/investigasi/:id_laporan", VerifyTokenAdmin, updateStatusLaporanInvestigasi);
router.patch("/laporan/status/selesai/:id_laporan", VerifyTokenAdmin, updateStatusLaporanSelesai);

module.exports = router;
