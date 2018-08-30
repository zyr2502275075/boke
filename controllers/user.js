const User = require('../models/user');
const static = require('../library/static');
const Category = require('../models/category');
const uploadConfig = require('../config/upload');
const fs = require('fs');
const path = require('../library/path');
const md5 = require('md5');

/**
 * 用户控制器
 */
const UserController = {
    login: (req, res, next) => {
        let username = req.body.username;
        let password = req.body.password;
        User.findOne({username: username}).then(document => {
            let user = document;
            if (user) {
                if (user.password == md5(password)) {
                    req.session.user = user;
                    //判断是否有登录前的页面，有就调整，没有就跳转到首页
                    let url = req.session.originalUrl ? req.session.originalUrl : '/';
                    res.redirect(url);
                } else {
                    req.flash('error', '登录失败, 用户名密码错误！');
                    res.redirect("/users/login");
                }
            } else {
                req.flash('error', '登录失败, 用户名密码错误！');
                res.redirect("/users/login");
            }
        });
    },
    logout: (req, res, next) => {
        delete req.session.user;
        res.redirect("/users/login");
    },
    personal: (req, res, next) => {
        let LoginUser = req.session.user;
        User.findOne({username: LoginUser.username}).then(document => {
            let user = document
            user.avatar = static( user.avatar);
            Category.find({'is_sys': 0}).where({delete_at: null}).where({pid: null}).then(document => {
                let category = document;
                res.render('personal', {user: user, personalCategoryList: category});
            });
        });
    },
    update: (req, res, next) => {
        let user = req.session.user;
        let imgData = req.body.img;
        let suffix = req.body.suffix;
        user.nickname = req.body.nickname;
        user.signature = req.body.signature;
        user.position = req.body.position;
        user.other = req.body.other;
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        let filepath = path.upload(suffix);
        if (base64Data) {
            fs.writeFile(uploadConfig.path + filepath, dataBuffer, function (err) {
                if (err) {
                    res.json({
                        'status': 1,
                        'msg': '保存失败!'
                    });
                } else {
                    user.avatar = filepath;
                    User.update({_id: user._id}, {$set: user}).then(document => {
                        res.json({
                            'status': 1,
                            'msg': '保存成功!'
                        });
                    }).catch(err => {
                        res.json({
                            'status': 1,
                            'msg': '保存失败!'
                        });
                    });
                }
            });
        } else {
            User.update({_id: user._id}, {$set: user}).then(document => {
                res.json({
                    'status': 1,
                    'msg': '保存成功!'
                });
            }).catch(err => {
                res.json({
                    'status': 1,
                    'msg': '保存失败!'
                });
            });
        }
    },
    password: (req, res, next) => {
        var old_password = req.body.old_password;
        var new_password = req.body.new_password;
        var confirm_password = req.body.confirm_password;
        let user = req.session.user;
        if (new_password != confirm_password) {
            res.json({
                'status': 0,
                'msg': '两次密码不一致!'
            });
        }
        User.findOne({_id: user._id}).then(doc => {
            if (md5(old_password) == doc.password) {
                User.update({_id: user._id}, {password: md5(new_password)}).then(doc => {
                    res.json({
                        'status': 0,
                        'msg': '修改成功!'
                    });
                });
            } else {
                res.json({
                    'status': 0,
                    'msg': '旧密码错误!'
                });
            }
        })
    }
}

module.exports = UserController;