/*
|--------------------------------------------------------------------------
| 静态资源路径转换
|--------------------------------------------------------------------------
|
*/
const upload = require('../config/upload');
const static = (src) => {
    if (src) {
        return upload.static + src;
    }
    return ''
}
module.exports = static;