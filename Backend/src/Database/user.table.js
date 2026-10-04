const connectDB = require("../config/db");

async function initUserDB() {

    const db = await connectDB();
    if(!db){
        console.log("Database Not Found!");
    }
    try{
        await db.execute(`
                CREATE TABLE IF NOT EXISTS users(
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log("USER Table created.")
    }catch(err){
        console.log("Failed to create USER Table")
        console.log(err)
    }finally{
        db.end();
    }
    
}
module.exports = initUserDB;
