const { DataTypes, Sequelize } = require("sequelize");
const db = require("../../database");
const User = require("../User/model");
const JenisPasien = require("../JenisPasien/model");

const Laporan = db.define(
  "laporan",
  {
    id_laporan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    nama_pasien: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_rekam_medis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ruangan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    umur: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asuransi: {
      type: DataTypes.ENUM("BPJS", "Jamkesda", "Umum/Pribadi", "Asuransi Swasta", "Pemerintah", "Perusahaan", "Lain-lain"),
      allowNull: false,
      validate: {
        isIn: [["BPJS", "Jamkesda", "Umum/Pribadi", "Asuransi Swasta", "Pemerintah", "Perusahaan", "Lain-lain"]],
      },
    },
    jenis_kelamin_pasien: {
      type: DataTypes.ENUM("Laki-laki", "Perempuan"),
      allowNull: false,
      validate: {
        isIn: [["Laki-laki", "Perempuan"]],
      },
    },
    waktu_mendapatkan_pelayanan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    waktu_kejadian_insiden: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    insiden: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kronologis_insiden: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insiden_terjadi_pada_pasien: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dampak_insiden_terhadap_pasien: {
      type: DataTypes.ENUM("Kematian", "Cedera Irreversibel / Cedera Berat", "Cedera Reversibel / Cedera Sedang", "Cedera Ringan", "Tidak ada cedera"),
      allowNull: false,
      validate: {
        isIn: [["Kematian", "Cedera Irreversibel / Cedera Berat", "Cedera Reversibel / Cedera Sedang", "Cedera Ringan", "Tidak ada cedera"]],
      },
    },
    probabilitas: {
      type: DataTypes.ENUM("Sangat jarang", "Jarang", "Mungkin", "Sering", "Sangat sering"),
      allowNull: false,
      validate: {
        isIn: [["Sangat jarang", "Jarang", "Mungkin", "Sering", "Sangat sering"]],
      },
    },
    orang_pertama_melaporkan_insiden: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_jenis_pasien: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tempat_insiden: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departement_penyebab_insiden: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tindak_lanjut_setelah_kejadian_dan_hasil: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yang_melakukan_tindak_lanjut_setelah_insiden: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kejadian_sama_pernah_terjadi_di_unit_lain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("dalam antrian", "investigasi", "laporan selesai", "laporan kedaluwarsa"),
      allowNull: false,
      defaultValue: "dalam antrian",
      validate: {
        isIn: [["dalam antrian", "investigasi", "laporan selesai", "laporan kedaluwarsa"]],
      },
    },
    tanggal_laporan_dikirim: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tanggal_laporan_kedaluwarsa: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diinvestigasi_oleh: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    gambar: {
      type: DataTypes.BLOB("medium"),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

User.hasMany(Laporan, {
  foreignKey: "id_user",
  as: "pelapor",
});
Laporan.belongsTo(User, {
  foreignKey: "id_user",
  as: "pelapor",
});

User.hasMany(Laporan, {
  foreignKey: "diinvestigasi_oleh",
  as: "investigator",
});
Laporan.belongsTo(User, {
  foreignKey: "diinvestigasi_oleh",
  as: "investigator",
});

JenisPasien.hasMany(Laporan, {
  foreignKey: "id_jenis_pasien",
});
Laporan.belongsTo(JenisPasien, {
  foreignKey: "id_jenis_pasien",
});

module.exports = Laporan;
