/*
|--------------------------------------------------------------------------
| 获取上传路径
|--------------------------------------------------------------------------
|
*/
const fs = require('fs');
const uuidV1 = require('uuid/v1');
const moment = require('moment');
const uploadConfig = require('../config/upload');
/**
 * 获取上传路径
 * @param suffix
 * @returns {string}
 */
const upload = (suffix) => {
    let dir = '/' + moment().format('YYYYMMDD');
    if (!fs.existsSync(uploadConfig.path + dir)) {
        fs.mkdirSync(uploadConfig.path + dir);
    }
    let filename = uuidV1() + suffix;
    return dir + '/' + filename;
}
module.exports = {
    upload
};