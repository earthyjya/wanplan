const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
let connection = mysql.createConnection({
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database
});

handleDisconnect(connection);

// open the MySQL connection
connection.connect(error => {
	if (error) throw error;
	console.log("Successfully connected to the database.");
});

function handleDisconnect(client) {
	client.on("error", function(error) {
		if (!error.fatal) return;
		if (error.code !== "PROTOCOL_CONNECTION_LOST") throw err;

		console.error("> Re-connecting lost MySQL connection: " + error.stack);

		// NOTE: This assignment is to a variable from an outer scope; this is extremely important
		// If this said `client =` it wouldn't do what you want. The assignment here is implicitly changed
		// to `global.connection =` in node.
		connection = mysql.createConnection(client.config);
		handleDisconnect(connection);
		connection.connect();
	});
}

module.exports = connection;
