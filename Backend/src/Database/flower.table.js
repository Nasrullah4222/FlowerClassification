const connectDB = require("../config/db");

async function initFlowerDB() {

    const db = await connectDB();

    if (!db) {
        console.log("Database Not found");
        return;
    }

    try {

        await db.execute(`
            CREATE TABLE IF NOT EXISTS flower (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                scientific_name VARCHAR(150),
                origin VARCHAR(250),
                common_myth TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("initFlowerDB created");

    } catch (err) {

        console.log("Failed to create FLOWER Table!");
        console.log(err);

    } finally {

        await db.end();

    }
}

module.exports = initFlowerDB;