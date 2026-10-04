const connectDB = require("../config/db");

async function findByName(name) {

    const db = await connectDB();
    const [result] = await db.execute(
            `SELECT * FROM users WHERE name = ?`, [name]
    );
    await db.end();

    return result;
}

async function createUser(name, password) {
    const db = await connectDB();
    const [result] = await db.execute(
        'INSERT INTO users (name, password) VALUES (?, ?)', [name, password]
    )
    await db.end();
    return result;
}


module.exports ={createUser, findByName};