// DATABASE
const cfg = process.env; // Get server configurations

const mysql = require("mysql");

// Start MySQL connection
const db = mysql.createConnection({
  host: cfg.DB_HOST,
  user: cfg.DB_USER,
  password: cfg.DB_PASSWORD,
  database: cfg.DB_DATABASE,
});
// Check DB initial configuration
db.connect((err) => {
  if (err) {
    console.log(
      "(✖) Error connecting to database. Maybe MySQL isn't running?"
    );
    process.exit();
  }
  console.log("(✔) Connected with database.");
  // Check if VO DB needs initial setup
  db.query(
    `SELECT vo_value FROM vo_settings WHERE vo_option = "admin_setup"`,
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        if (results[0].vo_value == "done") {
          cfg.NEEDS_INITIAL_SETUP = false;
        } else {
          cfg.NEEDS_INITIAL_SETUP = true;
          console.log(
            "(!) VirtualOffice requires an initial setup by the administrator."
          );
        }
      }
    }
  );
});

module.exports = db;
