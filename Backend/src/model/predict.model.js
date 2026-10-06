const connectDB = require("../config/db");

async function findByFlowerName(flowerName) {

    const db = await connectDB();
    const [result] = await db.execute(
            `SELECT * FROM flower WHERE name = ?`, [flowerName]
    );
    await db.end();

    return result[0];
}

async function createFlower(flowerName, scientific_name, origin, common_myth) {

    const db = await connectDB();

    const [result] = await db.execute(
        `INSERT INTO flower
        (name, scientific_name, origin, common_myth)
        VALUES (?, ?, ?, ?)`,
        [flowerName, scientific_name, origin, common_myth]
    );

    await db.end();

    return result;
}

async function createPrediction( userId, flowerId, imageUrl, confidence ) {
    const db = await connectDB();

    const [result] = await db.execute(
        `INSERT INTO predictions
        (user_id, flower_id, image_url, confidence)
        VALUES (?, ?, ?, ?)`,
        [userId, flowerId, imageUrl, confidence]
    );

    await db.end();

    return result;
}

module.exports = { createPrediction, findByFlowerName, createFlower};


