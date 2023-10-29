const Laporan = require("./model");
const User = require("../User/model");
const KajianLaporan = require("../KajianLaporan/model");
const fs = require("fs");
const path = require("path");
const db = require("../../database");
const JenisPasien = require("../JenisPasien/model");
const { Op, Sequelize } = require("sequelize");
const moment = require("moment-timezone");

//@description     Get All Laporan User Latest Order
//@route           GET /api/laporan?status=&month=&year=
//@access          Public
const getAllLaporan = async (req, res) => {
  try {
    const status = req.query.status;
    const month = req.query.month;
    const year = req.query.year;
    let laporan;

    if (status && month && year) {
      laporan = await Laporan.findAll({
        attributes: ["id_laporan", "nama_pasien", "insiden", "waktu_mendapatkan_pelayanan", "waktu_kejadian_insiden", "status", "tanggal_laporan_dikirim", "tanggal_laporan_kedaluwarsa", "gambar"],
        where: {
          [Op.and]: [Sequelize.literal(`MONTH(tanggal_laporan_dikirim) = ${month}`), Sequelize.literal(`YEAR(tanggal_laporan_dikirim) = ${year}`), Sequelize.literal(`status = '${status}'`)],
        },
        order: [["tanggal_laporan_dikirim", "DESC"]],
        include: [
          {
            model: User,
            as: "pelapor", // Memberi alias pada relasi pertama
            attributes: ["id_user", "username", "name", "job", "role"],
          },
          {
            model: User,
            as: "investigator", // Memberi alias pada relasi kedua
            attributes: ["id_user", "username", "name", "job", "role"],
          },
          {
            model: JenisPasien,
            attributes: ["id_jenis_pasien", "nama_jenis_pasien"],
          },
        ],
      });
    } else {
      laporan = await Laporan.findAll({
        attributes: ["id_laporan", "nama_pasien", "insiden", "waktu_mendapatkan_pelayanan", "waktu_kejadian_insiden", "status", "tanggal_laporan_dikirim", "tanggal_laporan_kedaluwarsa", "gambar"],
        order: [["tanggal_laporan_dikirim", "DESC"]],
        include: [
          {
            model: User,
            as: "pelapor", // Memberi alias pada relasi pertama
            attributes: ["id_user", "username", "name", "job", "role"],
          },
          {
            model: User,
            as: "investigator", // Memberi alias pada relasi kedua
            attributes: ["id_user", "username", "name", "job", "role"],
          },
          {
            model: JenisPasien,
            attributes: ["id_jenis_pasien", "nama_jenis_pasien"],
          },
        ],
      });
    }

    const revLaporan = laporan.map((item) => ({
      id_laporan: item.id_laporan,
      nama_pasien: item.nama_pasien,
      insiden: item.insiden,
      waktu_mendapatkan_pelayanan: `${moment(item.waktu_mendapatkan_pelayanan).tz("Asia/Makassar")}`,
      waktu_kejadian_insiden: `${moment(item.waktu_kejadian_insiden).tz("Asia/Makassar")}`,
      status: item.status,
      tanggal_laporan_dikirim: `${moment(item.tanggal_laporan_dikirim).tz("Asia/Makassar")}`,
      tanggal_laporan_kedaluwarsa: `${moment(item.tanggal_laporan_kedaluwarsa).tz("Asia/Makassar")}`,
      gambar: item.gambar,
    }));

    res.status(200).json({
      code: "200",
      status: "OK",
      data: revLaporan,
    });
  } catch (error) {
    console.log("Ini error: ", error);
    res.status(500).json({
      code: "500",
      status: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    });
  }
};

//@description     Get Laporan By Id Laporan untuk setiap status
//@route           GET /api/laporan/:id_laporan?status=
//@access          Public
const getLaporanByIdLaporan = async (req, res) => {
  try {
    const id_laporan = req.params.id_laporan;
    const status = req.query.status;
    console.log("status: ", status);
    if (status === "dalam antrian" || status === "investigasi" || status === "laporan kedaluwarsa") {
      const laporan = await Laporan.findOne({
        where: {
          id_laporan,
        },
        attributes: [
          "id_laporan",
          "id_user",
          "nama_pasien",
          "no_rekam_medis",
          "ruangan",
          "umur",
          "asuransi",
          "jenis_kelamin_pasien",
          "waktu_mendapatkan_pelayanan",
          "waktu_kejadian_insiden",
          "insiden",
          "kronologis_insiden",
          "insiden_terjadi_pada_pasien",
          "dampak_insiden_terhadap_pasien",
          "probabilitas",
          "orang_pertama_melaporkan_insiden",
          // jenis pasien
          "tempat_insiden",
          "departement_penyebab_insiden",
          "tindak_lanjut_setelah_kejadian_dan_hasil",
          "yang_melakukan_tindak_lanjut_setelah_insiden",
          "kejadian_sama_pernah_terjadi_di_unit_lain",
          "status",
          "tanggal_laporan_dikirim",
          "tanggal_laporan_kedaluwarsa",
          "gambar",
        ],
        include: [
          {
            model: User,
            as: "pelapor",
            attributes: ["id_user", "username", "name", "job", "role"],
          },
          {
            model: User,
            as: "investigator",
            attributes: ["id_user", "username", "name", "job", "role"],
          },
          {
            model: JenisPasien,
            attributes: ["id_jenis_pasien", "nama_jenis_pasien"],
          },
        ],
      });

      const revLaporan = {
        id_laporan: laporan.id_laporan,
        id_user: laporan.id_user,
        nama_pasien: laporan.nama_pasien,
        no_rekam_medis: laporan.no_rekam_medis,
        ruangan: laporan.ruangan,
        umur: laporan.umur,
        asuransi: laporan.asuransi,
        jenis_kelamin_pasien: laporan.jenis_kelamin_pasien,
        waktu_mendapatkan_pelayanan: `${moment(laporan.waktu_mendapatkan_pelayanan).tz("Asia/Makassar")}`,
        waktu_kejadian_insiden: `${moment(laporan.waktu_kejadian_insiden).tz("Asia/Makassar")}`,
        insiden: laporan.insiden,
        kronologis_insiden: laporan.kronologis_insiden,
        insiden_terjadi_pada_pasien: laporan.insiden_terjadi_pada_pasien,
        dampak_insiden_terhadap_pasien: laporan.dampak_insiden_terhadap_pasien,
        probabilitas: laporan.probabilitas,
        orang_pertama_melaporkan_insiden: laporan.orang_pertama_melaporkan_insiden,
        jenis_pasien: laporan.jenis_pasien.nama_jenis_pasien,
        tempat_insiden: laporan.tempat_insiden,
        departement_penyebab_insiden: laporan.departement_penyebab_insiden,
        tindak_lanjut_setelah_kejadian_dan_hasil: laporan.tindak_lanjut_setelah_kejadian_dan_hasil,
        yang_melakukan_tindak_lanjut_setelah_insiden: laporan.yang_melakukan_tindak_lanjut_setelah_insiden,
        kejadian_sama_pernah_terjadi_di_unit_lain: laporan.kejadian_sama_pernah_terjadi_di_unit_lain,
        status: laporan.status,
        tanggal_laporan_dikirim: `${moment(laporan.tanggal_laporan_dikirim).tz("Asia/Makassar")}`,
        tanggal_laporan_kedaluwarsa: `${moment(laporan.tanggal_laporan_kedaluwarsa).tz("Asia/Makassar")}`,
        gambar: laporan.gambar,

        pelapor_id_user: laporan.pelapor ? laporan.pelapor.id_user : null,
        pelapor_username: laporan.pelapor ? laporan.pelapor.username : null,
        pelapor_name: laporan.pelapor ? laporan.pelapor.name : null,
        pelapor_job: laporan.pelapor ? laporan.pelapor.job : null,
        pelapor_role: laporan.pelapor ? laporan.pelapor.role : null,

        investigator_id_user: laporan.investigator ? laporan.investigator.id_user : null,
        investigator_username: laporan.investigator ? laporan.investigator.username : null,
        investigator_name: laporan.investigator ? laporan.investigator.name : null,
        investigator_job: laporan.investigator ? laporan.investigator.job : null,
        investigator_role: laporan.pelapor ? laporan.pelapor.role : null,

        id_kajian_laporan: null,
        jenis_insiden: null,
        grading_risiko_kejadian: null,
        tanggal_laporan_diterima: null,
      };

      res.status(200).json({
        code: "200",
        status: "OK",
        data: revLaporan,
      });
    } else if (status === "laporan selesai") {
      const laporan = await KajianLaporan.findOne({
        where: {
          id_laporan,
        },
        attributes: ["id_kajian_laporan", "jenis_insiden", "grading_risiko_kejadian", "tanggal_laporan_diterima"],
        include: [
          {
            model: Laporan,
            attributes: [
              "id_laporan",
              "id_user",
              "nama_pasien",
              "no_rekam_medis",
              "ruangan",
              "umur",
              "asuransi",
              "jenis_kelamin_pasien",
              "waktu_mendapatkan_pelayanan",
              "waktu_kejadian_insiden",
              "insiden",
              "kronologis_insiden",
              "insiden_terjadi_pada_pasien",
              "dampak_insiden_terhadap_pasien",
              "probabilitas",
              "orang_pertama_melaporkan_insiden",
              // jenis pasien
              "tempat_insiden",
              "departement_penyebab_insiden",
              "tindak_lanjut_setelah_kejadian_dan_hasil",
              "yang_melakukan_tindak_lanjut_setelah_insiden",
              "kejadian_sama_pernah_terjadi_di_unit_lain",
              "status",
              "tanggal_laporan_dikirim",
              "tanggal_laporan_kedaluwarsa",
              "gambar",
            ],
            include: [
              {
                model: User,
                as: "pelapor",
                attributes: ["id_user", "username", "name", "job", "role"],
              },
              {
                model: User,
                as: "investigator",
                attributes: ["id_user", "username", "name", "job", "role"],
              },
              {
                model: JenisPasien,
                attributes: ["id_jenis_pasien", "nama_jenis_pasien"],
              },
            ],
          },
        ],
      });

      console.log("ini loh laporan selesai: ", laporan.laporan.id_laporan);

      const revLaporan = {
        id_laporan: laporan.laporan.id_laporan,
        id_user: laporan.laporan.id_user,
        nama_pasien: laporan.laporan.nama_pasien,
        no_rekam_medis: laporan.laporan.no_rekam_medis,
        ruangan: laporan.laporan.ruangan,
        umur: laporan.laporan.umur,
        asuransi: laporan.laporan.asuransi,
        jenis_kelamin_pasien: laporan.laporan.jenis_kelamin_pasien,
        waktu_mendapatkan_pelayanan: `${moment(laporan.laporan.waktu_mendapatkan_pelayanan).tz("Asia/Makassar")}`,
        waktu_kejadian_insiden: `${moment(laporan.laporan.waktu_kejadian_insiden).tz("Asia/Makassar")}`,
        insiden: laporan.laporan.insiden,
        kronologis_insiden: laporan.laporan.kronologis_insiden,
        insiden_terjadi_pada_pasien: laporan.laporan.insiden_terjadi_pada_pasien,
        dampak_insiden_terhadap_pasien: laporan.laporan.dampak_insiden_terhadap_pasien,
        probabilitas: laporan.laporan.probabilitas,
        orang_pertama_melaporkan_insiden: laporan.laporan.orang_pertama_melaporkan_insiden,
        jenis_pasien: laporan.laporan.jenis_pasien.nama_jenis_pasien,
        tempat_insiden: laporan.laporan.tempat_insiden,
        departement_penyebab_insiden: laporan.laporan.departement_penyebab_insiden,
        tindak_lanjut_setelah_kejadian_dan_hasil: laporan.laporan.tindak_lanjut_setelah_kejadian_dan_hasil,
        yang_melakukan_tindak_lanjut_setelah_insiden: laporan.laporan.yang_melakukan_tindak_lanjut_setelah_insiden,
        kejadian_sama_pernah_terjadi_di_unit_lain: laporan.laporan.kejadian_sama_pernah_terjadi_di_unit_lain,
        status: laporan.laporan.status,
        tanggal_laporan_dikirim: `${moment(laporan.laporan.tanggal_laporan_dikirim).tz("Asia/Makassar")}`,
        tanggal_laporan_kedaluwarsa: `${moment(laporan.laporan.tanggal_laporan_kedaluwarsa).tz("Asia/Makassar")}`,
        gambar: laporan.laporan.gambar,

        pelapor_id_user: laporan.laporan.pelapor ? laporan.laporan.pelapor.id_user : null,
        pelapor_username: laporan.laporan.pelapor ? laporan.laporan.pelapor.username : null,
        pelapor_name: laporan.laporan.pelapor ? laporan.laporan.pelapor.name : null,
        pelapor_job: laporan.laporan.pelapor ? laporan.laporan.pelapor.job : null,
        pelapor_role: laporan.laporan.pelapor ? laporan.laporan.pelapor.role : null,

        investigator_id_user: laporan.laporan.investigator ? laporan.laporan.investigator.id_user : null,
        investigator_username: laporan.laporan.investigator ? laporan.laporan.investigator.username : null,
        investigator_name: laporan.laporan.investigator ? laporan.laporan.investigator.name : null,
        investigator_job: laporan.laporan.investigator ? laporan.laporan.investigator.job : null,
        investigator_role: laporan.laporan.investigator ? laporan.laporan.investigator.role : null,

        id_kajian_laporan: laporan.id_kajian_laporan,
        jenis_insiden: laporan.jenis_insiden,
        grading_risiko_kejadian: laporan.grading_risiko_kejadian,
        tanggal_laporan_diterima: `${moment(laporan.tanggal_laporan_diterima).tz("Asia/Makassar")}`,
      };

      res.status(200).json({
        code: "200",
        status: "OK",
        data: revLaporan,
      });
    } else {
      res.status(400).json({
        code: "400",
        status: "BAD_REQUEST",
        errors: "There's no parameter 'status'",
      });
    }
  } catch (error) {
    console.log("Ini error: ", error);
    res.status(500).json({
      code: "500",
      status: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    });
  }
};

//@description     Get Laporan User By Id User desc order (Latest)
//@route           GET /api/laporan/user/:id_user
//@access          Public
const getLaporanByUserId = async (req, res) => {
  try {
    const id_user = req.params.id_user;
    console.log("ini id user: ", id_user);

    const laporan = await Laporan.findAll({
      attributes: ["id_laporan", "status", "tanggal_laporan_dikirim", "gambar"],
      where: {
        id_user,
      },
      order: [["tanggal_laporan_dikirim", "DESC"]],
    });

    const revLaporan = laporan.map((item) => ({
      id_laporan: item.id_laporan,
      status: item.status,
      tanggal_laporan_dikirim: `${moment(item.tanggal_laporan_dikirim).tz("Asia/Makassar")}`,
      gambar: item.gambar,
    }));

    res.status(200).json({
      code: "200",
      status: "OK",
      data: revLaporan,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      code: "500",
      status: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    });
  }
};

//@description     Get 3 Laporan User By Id User Latest order
//@route           GET /api/laporan/user/latest/:id_user
//@access          Public
const getLatestThreeLaporanByUserId = async (req, res) => {
  try {
    const id_user = req.params.id_user;

    const laporan = await Laporan.findAll({
      attributes: ["id_laporan", "status", "tanggal_laporan_dikirim", "gambar"],
      where: {
        id_user,
      },
      order: [["tanggal_laporan_dikirim", "DESC"]],
      limit: 3,
    });

    const revLaporan = laporan.map((item) => ({
      id_laporan: item.id_laporan,
      status: item.status,
      tanggal_laporan_dikirim: `${moment(item.tanggal_laporan_dikirim).tz("Asia/Makassar")}`,
      gambar: item.gambar,
    }));

    res.status(200).json({
      code: "200",
      status: "OK",
      data: revLaporan,
    });
  } catch (error) {
    console.log("Ini error: ", error);
    res.status(500).json({
      code: "500",
      status: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    });
  }
};

//@description     Get All Laporan today latest
//@route           GET /api/laporan/current/day
//@access          Public
const getLaporanToday = async (req, res) => {
  const TODAY_START = moment.tz("Asia/Makassar").startOf("day");
  const NOW = moment.tz("Asia/Makassar");

  console.log("ini now: ", NOW);
  console.log("ini today start: ", TODAY_START);

  try {
    const laporan = await Laporan.findAll({
      where: {
        tanggal_laporan_dikirim: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
      order: [["tanggal_laporan_dikirim", "DESC"]],
      limit: 10,
    });

    const revLaporan = laporan.map((item) => ({
      id_laporan: item.id_laporan,
      status: item.status,
      tanggal_laporan_dikirim: `${moment(item.tanggal_laporan_dikirim).tz("Asia/Makassar")}`,
      gambar: item.gambar,
    }));

    res.status(200).json({
      code: "200",
      status: "OK",
      data: revLaporan,
    });
  } catch (error) {
    res.status(500).json({
      code: "500",
      status: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    });
  }
};

//@description     Get All Laporan current month latest
//@route           GET /api/laporan/current/month
//@access          Public
const getLaporanCurrentMonth = async (req, res) => {
  try {
    const NOW = moment.tz("Asia/Makassar");

    console.log("ini now: ", NOW);

    const currentMonth = NOW.month() + 1;
    const currentYear = NOW.year();

    console.log("ini current month: ", currentMonth);
    console.log("ini current year: ", currentYear);

    const laporan = await Laporan.findAll({
      where: {
        [Op.and]: [Sequelize.literal(`MONTH(tanggal_laporan_dikirim) = ${currentMonth}`), Sequelize.literal(`YEAR(tanggal_laporan_dikirim) = ${currentYear}`)],
      },
      attributes: ["id_laporan", "status", "tanggal_laporan_dikirim", "gambar"],
      order: [["tanggal_laporan_dikirim", "DESC"]],
      limit: 10,
    });

    const revLaporan = laporan.map((item) => ({
      id_laporan: item.id_laporan,
      status: item.status,
      tanggal_laporan_dikirim: `${moment(item.tanggal_laporan_dikirim).tz("Asia/Makassar")}`,
      gambar: item.gambar,
    }));

    res.status(200).json({
      code: "200",
      status: "OK",
      data: revLaporan,
    });
  } catch (error) {
    res.status(500).json({
      code: "500",
      status: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    });
  }
};

//@description     Get amount Laporan User By Id User
//@route           GET /api/laporan/amount/user/:id_user
//@access          Public
const getAmountLaporanByUserId = async (req, res, next) => {
  try {
    const id_user = req.params.id_user;

    const laporan = await Laporan.count({
      where: {
        id_user,
      },
    });

    res.status(200).json({
      code: "200",
      status: "OK",
      data: laporan,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      code: "500",
      status: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    });
  }
};

//@description     Get jumlah laporan filter by month and year
//@route           GET /api/laporan/amount
//@access          Public
const getLaporanAmount = async (req, res) => {
  const month = req.query.month;
  const year = req.query.year;

  if (month && year) {
    try {
      const amountLaporanDalamAntrian = await Laporan.count({
        where: {
          [Op.and]: [Sequelize.literal(`MONTH(tanggal_laporan_dikirim) = ${month}`), Sequelize.literal(`YEAR(tanggal_laporan_dikirim) = ${year}`), Sequelize.literal(`status = 'dalam antrian'`)],
        },
      });

      const amountLaporanInvestigasi = await Laporan.count({
        where: {
          [Op.and]: [Sequelize.literal(`MONTH(tanggal_laporan_dikirim) = ${month}`), Sequelize.literal(`YEAR(tanggal_laporan_dikirim) = ${year}`), Sequelize.literal(`status = 'investigasi'`)],
        },
      });

      const amountLaporanSelesai = await Laporan.count({
        where: {
          [Op.and]: [Sequelize.literal(`MONTH(tanggal_laporan_dikirim) = ${month}`), Sequelize.literal(`YEAR(tanggal_laporan_dikirim) = ${year}`), Sequelize.literal(`status = 'laporan selesai'`)],
        },
      });

      const amountLaporanKedaluwarsa = await Laporan.count({
        where: {
          [Op.and]: [Sequelize.literal(`MONTH(tanggal_laporan_dikirim) = ${month}`), Sequelize.literal(`YEAR(tanggal_laporan_dikirim) = ${year}`), Sequelize.literal(`status = 'laporan kedaluwarsa'`)],
        },
      });

      const amountAllLaporan = amountLaporanDalamAntrian + amountLaporanInvestigasi + amountLaporanSelesai + amountLaporanKedaluwarsa;

      console.log("jumlah laporan dalam antrian: ", amountLaporanDalamAntrian);
      console.log("jumlah laporan investigasi: ", amountLaporanInvestigasi);
      console.log("jumlah laporan laporan selesai: ", amountLaporanSelesai);
      console.log("jumlah laporan laporan kedaluwarsa: ", amountLaporanKedaluwarsa);
      console.log("jumlah laporan semua: ", amountAllLaporan);

      res.status(200).json({
        code: "200",
        status: "OK",
        data: {
          jumlah_laporan_dalam_antrian: amountLaporanDalamAntrian,
          jumlah_laporan_investigasi: amountLaporanInvestigasi,
          jumlah_laporan_selesai: amountLaporanSelesai,
          jumlah_laporan_kedaluwarsa: amountLaporanKedaluwarsa,
          jumlah_keseluruhan: amountAllLaporan,
        },
      });
    } catch (error) {
      res.status(500).json({
        code: "500",
        status: "INTERNAL_SERVER_ERROR",
        errors: error.message,
      });
    }
  } else {
    res.status(400).json({
      code: "400",
      status: "BAD_REQUEST",
      errors: "There's no query parameter month or year at your endpoint",
    });
  }
};

//@description     Post laporan By User
//@route           POST /api/laporan/user/:id_user
//@access          Public
const postLaporanByUser = async (req, res) => {
  const NOW = moment.tz("Asia/Makassar");
  const tanggal_laporan_dikirim = NOW;
  const tanggal_laporan_kedaluwarsa = NOW.clone().add(48, "hours");

  console.log("ini tanggal laporan dikirim: ", tanggal_laporan_dikirim);
  console.log("ini tanggal laporan kedaluwarsa: ", tanggal_laporan_kedaluwarsa);

  const user = await User.findOne({
    where: {
      id_user: req.params.id_user,
    },
  });

  if (!user)
    return res.status(400).json({
      code: "400",
      status: "BAD_REQUEST",
      errors: "user id not found",
    });

  let url_gambar = null;

  if (req.file) {
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const ext = path.extname(req.file.originalname);

    url_gambar = `https://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpeg", ".jpg"];

    if (!allowedType.includes(ext.toLowerCase())) {
      fs.unlinkSync(path.join(__dirname, "..", "..", "public/images", req.file.filename));
      return res.status(400).json({
        code: "400",
        status: "BAD_REQUEST",
        errors: "Invalid Images. Image should be .png .jpg .jpeg",
      });
    }

    if (fileSize > 2097152) {
      fs.unlinkSync(path.join(__dirname, "..", "..", "public/images", req.file.filename));
      return res.status(400).json({
        code: "400",
        status: "BAD_REQUEST",
        errors: "Image must less than 2MB",
      });
    }

    const target = path.join(__dirname, "..", "..", "public/images", fileName);
    fs.renameSync(req.file.path, target);
  }

  const id_user = req.params.id_user;
  const {
    nama_pasien,
    no_rekam_medis,
    ruangan,
    umur,
    asuransi,
    jenis_kelamin_pasien,
    waktu_mendapatkan_pelayanan,
    waktu_kejadian_insiden,
    insiden,
    kronologis_insiden,
    insiden_terjadi_pada_pasien,
    dampak_insiden_terhadap_pasien,
    probabilitas,
    orang_pertama_melaporkan_insiden,
    id_jenis_pasien,
    tempat_insiden,
    departement_penyebab_insiden,
    tindak_lanjut_setelah_kejadian_dan_hasil,
    yang_melakukan_tindak_lanjut_setelah_insiden,
    kejadian_sama_pernah_terjadi_di_unit_lain,
  } = req.body;

  console.log("ini adalah waktu kejadian insiden: ", waktu_kejadian_insiden);

  if (
    (id_user,
    nama_pasien,
    no_rekam_medis,
    ruangan,
    umur,
    asuransi,
    jenis_kelamin_pasien,
    waktu_mendapatkan_pelayanan,
    waktu_kejadian_insiden,
    insiden,
    kronologis_insiden,
    insiden_terjadi_pada_pasien,
    dampak_insiden_terhadap_pasien,
    probabilitas,
    orang_pertama_melaporkan_insiden,
    id_jenis_pasien,
    tempat_insiden,
    departement_penyebab_insiden,
    tindak_lanjut_setelah_kejadian_dan_hasil,
    yang_melakukan_tindak_lanjut_setelah_insiden,
    kejadian_sama_pernah_terjadi_di_unit_lain)
  ) {
    try {
      const laporan = await Laporan.create({
        id_user,
        nama_pasien,
        no_rekam_medis,
        ruangan,
        umur,
        asuransi,
        jenis_kelamin_pasien,
        waktu_mendapatkan_pelayanan,
        waktu_kejadian_insiden,
        insiden,
        kronologis_insiden,
        insiden_terjadi_pada_pasien,
        dampak_insiden_terhadap_pasien,
        probabilitas,
        orang_pertama_melaporkan_insiden,
        id_jenis_pasien,
        tempat_insiden,
        departement_penyebab_insiden,
        tindak_lanjut_setelah_kejadian_dan_hasil,
        yang_melakukan_tindak_lanjut_setelah_insiden,
        kejadian_sama_pernah_terjadi_di_unit_lain,
        tanggal_laporan_dikirim,
        tanggal_laporan_kedaluwarsa,
        gambar: url_gambar,
      });

      res.status(201).json({
        code: "201",
        status: "CREATED",
        data: laporan,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        code: "500",
        status: "INTERNAL_SERVER_ERROR",
        errors: error.message,
      });
    }
  } else {
    res.status(400).json({
      code: "400",
      status: "BAD_REQUEST",
      errors: "All Fields Are Required",
    });
  }
};

//@description     Post laporan By Anonim
//@route           POST /api/laporan
//@access          Public
const postLaporanByAnonim = async (req, res) => {
  let url_gambar = null;

  const tanggal_laporan_dikirim = moment.tz("Asia/Makassar");
  const tanggal_laporan_kedaluwarsa = tanggal_laporan_dikirim.clone().add(48, "hours");

  if (req.file) {
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const ext = path.extname(req.file.originalname);

    url_gambar = `https://${req.get("host")}/images/${fileName}`;
    console.log("url gambar: ", url_gambar);
    const allowedType = [".png", ".jpeg", ".jpg"];

    if (!allowedType.includes(ext.toLowerCase())) {
      fs.unlinkSync(path.join(__dirname, "..", "..", "public/images", req.file.filename));
      return res.status(400).json({
        code: "400",
        status: "BAD_REQUEST",
        errors: "Invalid Images. Image should be .png .jpg .jpeg",
      });
    }

    if (fileSize > 2097152) {
      fs.unlinkSync(path.join(__dirname, "..", "..", "public/images", req.file.filename));
      return res.status(400).json({
        code: "400",
        status: "BAD_REQUEST",
        errors: "Image must less than 2MB",
      });
    }

    const target = path.join(__dirname, "..", "..", "public/images", fileName);
    fs.renameSync(req.file.path, target);
  }

  const {
    nama_pasien,
    no_rekam_medis,
    ruangan,
    umur,
    asuransi,
    jenis_kelamin_pasien,
    waktu_mendapatkan_pelayanan,
    waktu_kejadian_insiden,
    insiden,
    kronologis_insiden,
    insiden_terjadi_pada_pasien,
    dampak_insiden_terhadap_pasien,
    probabilitas,
    orang_pertama_melaporkan_insiden,
    id_jenis_pasien,
    tempat_insiden,
    departement_penyebab_insiden,
    tindak_lanjut_setelah_kejadian_dan_hasil,
    yang_melakukan_tindak_lanjut_setelah_insiden,
    kejadian_sama_pernah_terjadi_di_unit_lain,
  } = req.body;

  if (
    (nama_pasien,
    no_rekam_medis,
    ruangan,
    umur,
    asuransi,
    jenis_kelamin_pasien,
    waktu_mendapatkan_pelayanan,
    waktu_kejadian_insiden,
    insiden,
    kronologis_insiden,
    insiden_terjadi_pada_pasien,
    dampak_insiden_terhadap_pasien,
    probabilitas,
    orang_pertama_melaporkan_insiden,
    id_jenis_pasien,
    tempat_insiden,
    departement_penyebab_insiden,
    tindak_lanjut_setelah_kejadian_dan_hasil,
    yang_melakukan_tindak_lanjut_setelah_insiden,
    kejadian_sama_pernah_terjadi_di_unit_lain)
  ) {
    try {
      const laporan = await Laporan.create({
        nama_pasien,
        no_rekam_medis,
        ruangan,
        umur,
        asuransi,
        jenis_kelamin_pasien,
        waktu_mendapatkan_pelayanan,
        waktu_kejadian_insiden,
        insiden,
        kronologis_insiden,
        insiden_terjadi_pada_pasien,
        dampak_insiden_terhadap_pasien,
        probabilitas,
        orang_pertama_melaporkan_insiden,
        id_jenis_pasien,
        tempat_insiden,
        departement_penyebab_insiden,
        tindak_lanjut_setelah_kejadian_dan_hasil,
        yang_melakukan_tindak_lanjut_setelah_insiden,
        kejadian_sama_pernah_terjadi_di_unit_lain,
        tanggal_laporan_dikirim,
        tanggal_laporan_kedaluwarsa,
        gambar: url_gambar,
      });

      res.status(201).json({
        code: "201",
        status: "CREATED",
        data: laporan,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        code: "500",
        status: "INTERNAL_SERVER_ERROR",
        errors: error.message,
      });
    }
  } else {
    res.status(400).json({
      code: "400",
      status: "BAD_REQUEST",
      errors: "All Fields Are Required",
    });
  }
};

//@description     Update status laporan 'investigasi'
//@route           PATCH /api/laporan/status_laporan/investigasi/:id_laporan
//@access          Public
const updateStatusLaporanInvestigasi = async (req, res) => {
  const id_laporan = req.params.id_laporan;
  const id_user = req.id_user;
  const diinvestigasi_oleh = req.body.diinvestigasi_oleh;

  console.log("ini id_user: ", id_user);

  if (!diinvestigasi_oleh) {
    return res.status(400).json({
      code: "400",
      status: "BAD_REQUEST",
      errors: "There's no Request Body diinvestigasi_oleh",
    });
  }
  const t = await db.transaction();
  try {
    const laporan = await Laporan.update(
      {
        status: "investigasi",
        diinvestigasi_oleh,
      },
      {
        where: {
          id_laporan,
          status: "dalam antrian",
        },
        transaction: t,
      }
    );

    const cekKajianLaporan = await KajianLaporan.findOne({
      where: {
        id_laporan,
      },
    });

    if (cekKajianLaporan) {
      await t.rollback();
      return res.status(409).json({
        code: "409",
        status: "CONFLICT",
        errors: `id laporan ${id_laporan} has had listed in Kajian Laporan`,
      });
    }

    await KajianLaporan.create(
      {
        id_laporan,
        id_user,
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    console.log("ini hasil update: ", laporan[0]);

    res.status(200).json({
      code: "200",
      status: "OK",
      success: laporan[0] ? true : false,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      code: "500",
      status: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    });
  }
};

//@description     Update status laporan 'laporan selesai'
//@route           PATCH /api/laporan/status_laporan/selesai/:id_laporan
//@access          Public
const updateStatusLaporanSelesai = async (req, res) => {
  const id_laporan = req.params.id_laporan;
  const { jenis_insiden, grading_risiko_kejadian } = req.body;

  const tanggal_laporan_diterima = moment.tz("Asia/Makassar");

  if (jenis_insiden && grading_risiko_kejadian) {
    const t = await db.transaction();
    try {
      await KajianLaporan.update(
        {
          jenis_insiden,
          grading_risiko_kejadian,
          tanggal_laporan_diterima,
        },
        {
          where: {
            id_laporan,
          },
          transaction: t,
        }
      );

      const laporan = await Laporan.update(
        {
          status: "laporan selesai",
        },
        {
          where: {
            id_laporan,
            status: "investigasi",
          },
          transaction: t,
        }
      );

      await t.commit();
      res.status(200).json({
        code: "200",
        status: "OK",
        success: laporan[0] ? true : false,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        code: "500",
        status: "INTERNAL_SERVER_ERROR",
        errors: error.message,
      });
    }
  } else {
    res.status(400).json({
      code: "400",
      status: "BAD_REQUEST",
      errors: "jenis_insiden and grading_risiko_kejadian are required",
    });
  }
};

module.exports = {
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
};
