var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const ObjectId = Schema.Types.ObjectId;
/**
 * 用户
 */
const UserSchema = new Schema({
    username: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: ''
    },
    nickname: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    signature: {
        type: String,
        default: ''
    },
    position: {
        type: String,
        default: ''
    },
    other: {
        type: String,
        default: ''
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
 * 用户实体
 */
var User = mongoose.model('User', UserSchema);
module.exports = User;