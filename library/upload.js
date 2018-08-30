const fs = require('fs');
const multer = require('multer');
const path = require('path');
const uuidV1 = require('uuid/v1');
const moment = require('moment');
const uploadConfig = require('../config/upload');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadConfig.path)
    },
    filename: function (req, file, cb) {
        if (file) {
            let dir = '/' + moment().format('YYYYMMDD');
            if (!fs.existsSync(uploadConfig.path + dir)) {
                fs.mkdirSync(uploadConfig.path + dir);
            }
            let filename = uuidV1() + path.extname(file.originalname);
            cb(null, dir + '/' + filename);
        }
    }
});
const upload = multer({
    storage: storage
});
module.exports = upload;