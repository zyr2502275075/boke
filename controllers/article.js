const Article = require('../models/article');
const Category = require('../models/category');
const uploadConfig = require('../config/upload');
const fs = require('fs');
const path = require('../library/path');

const ArticleController = {
    /**
     * 列表
     */
    index: (req, res, next) => {
        //搜索关键字
        let key = req.query.key;
        let regex = new RegExp(key);
        //分页
        let count = 0;
        let limit = 2;
        let page = req.query.page ? req.query.page : 1;
        let totalPage = 0;
        let is_jing = req.query.is_jing;
        let where = {};
        if (key) {
            where.title = {$regex: regex};
        }
        if (is_jing == 1) {
            where.jing = 1
        }
        //count()返回符合条件的文档数
        //limit(3)	限制返回结果的数量,skip(3)	跳过前3个文档,返回其余的
        //Math.ceil()函数向上取整
        Article.find(where).count().then(doc => {
            count = doc;
            totalPage = Math.ceil(count / limit)
            Article.find(where).skip((page - 1) * limit).limit(2).sort({create_at: 'desc'}).then(doc => {
                res.json({
                    status: 1,
                    result: {
                        list: doc,
                        totalPage: totalPage,
                        page: page,
                        count: count,
                        limit: limit
                    }
                });
            })
        });
    },

    /**
     * 获取文章
     */
    get: (req, res, next) => {
        Article.findOne({_id: req.params.id}).then(document => {
            let view = document.view + 1;
            //点击阅读之后，根据id，会更新阅读数量
            Article.update({_id: req.params.id}, {$set: {view: view}}).then(document => {
            });
            document.img = '/uploads/' + document.img;
            res.render('article', {
                article: document
            })
        });
    },
    /**
     * 详情
     */
    getAjax: (req, res, next) => {
        Article.findOne({_id: req.params.id}).then(doc => {
            res.json({
                'status': 1,
                'result': doc
            });
        })
    },
    /**
     * 发布文章页面
     */
    add: (req, res, next) => {
        Category.find({'is_sys': 0}).where({delete_at: null}).where({pid: null}).then(document => {
            res.render('add_article', {categoryList: document})
        });
    },
    /**
     * 保存文章
     */
    save: (req, res, next) => {
        let filename = '';
        if (req.file) {
            filename = req.file.filename;
        }
        let article = new Article({
            'img': filename,
            'title': req.body.title,
            'category': req.body.category,
            'author': req.body.author,
            'jing': req.body.jing,
            'contents': req.body.contents
        });
        article.save();
        req.flash('info', '发布成功！');
        res.redirect("/");
    },
    /**
     * 更新文章
     */
    update: (req, res, next) => {
        let id = req.params.id;
        let imgData = req.body.imgData;
        let suffix = req.body.suffix;
        let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        //Base64编解码算法在Nodejs的buffer组件中有支持，下面一句是解码，之后赋给dataBuffer
        let dataBuffer = new Buffer(base64Data, 'base64');
        let filepath = path.upload(suffix);
        if (base64Data) {
            //三个参数，第一个文件名称，第二个将要写入的内容，可以是字符串或buffer数据，
            // 第三个是回调，传递一个异常参数err
            fs.writeFile(uploadConfig.path + filepath, dataBuffer, function (err) {
                if (err) {
                    res.json({
                        'status': 1,
                        'msg': '保存失败!'
                    });
                } else {
                    Article.update({_id: id}, {
                        'img': filepath,
                        'title': req.body.title,
                        'category': req.body.category,
                        'author': req.body.author,
                        'jing': req.body.jing,
                        'contents': req.body.contents
                    }).then(doc => {
                        res.json({
                            status: 1,
                            msg: '保存成功！'
                        })
                    }).catch(err => {
                        res.json({
                            status: 0,
                            msg: '保存失败！'
                        })
                    });
                }
            });
        } else {
            Article.update({_id: id}, {
                'title': req.body.title,
                'category': req.body.category,
                'author': req.body.author,
                'jing': req.body.jing,
                'contents': req.body.contents
            }).then(doc => {
                res.json({
                    status: 1,
                    msg: '保存成功！'
                })
            }).catch(err => {
                res.json({
                    status: 0,
                    msg: '保存失败！'
                })
            });
        }
    },
    /**
     * 删除文章
     */
    delete: (req, res, next) => {
        Article.remove({_id: req.params.id}).then(doc => {
            res.json({
                status: 1,
                msg: '删除成功！'
            });
        }).then(err => {
            res.json({
                status: 1,
                msg: '删除失败！'
            });
        });
    }
}
module.exports = ArticleController;
