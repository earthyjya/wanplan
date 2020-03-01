const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
let pool = mysql.createPool({
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database
});

pool.getConnection(function(err, connection) {
	if (err) throw err; // not connected!
	else {
		console.log("Successfully connected to the database.");
		connection.release();
	}
});

module.exports = pool;
