const mysql = require("mysql2/promise");

/**
 * @s_1 Connect SQL server
 * @s_2 Creating a DB
 * @s_3 Creating a Table
 * @s_4 Perform CRUD operation
 */

// Step - 1
async function connectDB() {
    try {
        const sql_db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "adminSijan4222",
            database: "flower_classification"
        });
        console.log("MySQL connected.");
        return sql_db;
    } catch (err) {
        console.log("Couldn't connect to MySQL.");
        console.log(err);
    }
    //Create DB to workebench.
}

module.exports = connectDB;