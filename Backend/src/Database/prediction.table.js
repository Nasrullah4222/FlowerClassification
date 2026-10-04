const connectDB = require("../config/db");

async function initPredictionDB() {

    const db = await connectDB();
    if(!db){
        console.log("Database not found");
    }
    try{
        await db.execute(`
                CREATE TABLE IF NOT EXISTS predictions (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    user_id INT,
                    flower_id INT,
                    image_url VARCHAR(500),
                    confidence DECIMAL(5,2),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (flower_id) REFERENCES flower(id)
                );
            `)
        console.log("Prediction Table created")
    }catch(err){
        console.log("Failed to create PREDICTION Table");
        console.log(err)
    }finally{
        db.end();
    }   
}
module.exports = initPredictionDB;