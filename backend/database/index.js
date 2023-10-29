const { Sequelize } = require("sequelize");
const { dbName, dbUsername, dbPassword, dbHostname, port } = require("../config/index.js");

const db = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHostname,
  port,
  dialect: "mysql",
  // timezone: "Asia/Makassar",
  timezone: "+08:00",
});

db.authenticate()
  .then(() => {
    console.log("Koneksi berhasil");
    // db.sync({ force: true })
    //   .then(() => {
    //     console.log("All models were synchronized successfuly");
    //   })
    //   .catch((error) => console.log("error saat sinkronisasi: ", error));
  })
  .catch((error) => console.log("Unable to connect to the database : ", error));

module.exports = db;
