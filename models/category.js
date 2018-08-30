var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const ObjectId = Schema.Types.ObjectId;
/**
 * 栏目
 */
const CategorySchema = new Schema({
    name: String,
    path: String,
    sort: {
        type: Number,
        default: 100
    },
    //栏目的父id
    pid: {
        type: ObjectId,
        ref: 'Category'
    },
    category: [{
        type: ObjectId,
        ref: 'Category'
    }],
    template: {
        type: String,
        default: ''
    },
    is_sys: {
        type: Number,
        default: 0
    },
    is_nav: {
        type: Number,
        default: 0
    },
    create_at: {
        type: Date,
        default: Date.now,
        get: val => moment(val).format('YYYY-MM-DD HH:mm')
    },
    update_at: {
        type: Date,
        default: Date.now,
        get: val => moment(val).format('YYYY-MM-DD HH:mm')
    },
    delete_at: {
        type: Date,
        default: null,
        get: val => moment(val).format('YYYY-MM-DD HH:mm')
    }
})

/**
 * 栏目实体，，将名为CategorySchema的Schema与Category名字绑定，即是存入数据库的名字
 * ，但存入数据库中的名字是Categorys，会自动添加一个s。
 * 这里将Model命名为Category(即var 后面的)，需要对表操作的话，都需要使用变量名Category。
 */
var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;