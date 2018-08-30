/*
|--------------------------------------------------------------------------
| mongodb 数据库链接
|--------------------------------------------------------------------------
|
*/

const mongoose = require('mongoose');
const colors = require('colors');
const database = require('../config/database');
const mongodb = database.mongodb;

/*
|--------------------------------------------------------------------------
| mongodb启动uri 启动配置从config/database中读取
|--------------------------------------------------------------------------
|
*/
//指定用户连接
//const uri = `${mongodb.client}://web01:123456@${mongodb.connection.host}:${mongodb.connection.port}/${mongodb.connection.name}`;
let uri = '';
if (mongodb.connection.username) {
    uri = `${mongodb.client}://${mongodb.connection.username}:${mongodb.connection.password}@${mongodb.connection.host}:${mongodb.connection.port}/${mongodb.connection.name}`;
} else {
    uri = `${mongodb.client}://${mongodb.connection.host}:${mongodb.connection.port}/${mongodb.connection.name}`;
}

/*
|--------------------------------------------------------------------------
| 数据库启动并链接
|--------------------------------------------------------------------------
|
*/
const db = mongoose.connect(uri, {useMongoClient: true}, (err, db) => {
    if (err) {
        console.log('数据库链接失败!'['red'] + err)
    } else {
        console.log('数据库已创建!'['blue'])
    }
});

/*
|--------------------------------------------------------------------------
| 全局的Promise对象赋值给mongoose
|--------------------------------------------------------------------------
|
*/
mongoose.Promise = global.Promise;

/*
|--------------------------------------------------------------------------
| 导出数据库
|--------------------------------------------------------------------------
|
*/
module.expores = db;