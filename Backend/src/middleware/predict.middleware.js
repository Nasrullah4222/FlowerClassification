const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 9*10124*1024
    }
})
module.exports = upload