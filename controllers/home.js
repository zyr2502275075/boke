const Article = require('../models/article');
const Category = require('../models/category');
const trimHtml = require('trim-html');
const static = require('../library/static');

/**
 * 首页
 */
const Home = {
    /**
     * 首页
     */
    index: (req, res, next) => {
        let searchVal = req.query.searchVal ? req.query.searchVal : '';
        let regx = new RegExp(searchVal);
        Article.find({title: {$regex: regx}}).where({delete_at: null}).count().then(total => {
            let page = req.query.page ? req.query.page : 1;
            let rows = 5;
            let totalPage = Math.ceil(total / rows);
            if (page > 1 && page > totalPage) {
                let err = new Error('Not Found');
                err.status = 404;
                next(err);
            } else {
                Article.find({title: {$regex: regx}})
                    .where({'delete_at': null})
                    .skip((page - 1) * 2)
                    .limit(rows)
                    .sort({'create_at': 'desc'})
                    .then(document => {
                        document.forEach((data) => {
                            if (data.img) {
                                data.img = static(data.img);
                            }
                            let contents = trimHtml(data.contents, {limit: 100, preserveTags: false, sufix: '...'});
                            data.contents = contents.html;
                        })
                        res.render('index', {
                                'list': document,
                                'page': page,
                                'rows': 'rows',
                                'totalPage': totalPage,
                                'total': total
                            }
                        );
                    });
            }
        });
    },

    /**
     * 栏目页
     */
    category: (req, res, next) => {
        let categoryPath = req.params.path;
        Category.findOne({path: '/' + categoryPath}).where({delete_at: null}).then(document => {
            if (!document) {
                let err = new Error('Not Found');
                err.status = 404;
                next(err);
            } else {
                Article.find({category: document._id}).where({delete_at: null}).count().then(total => {
                    let page = req.query.page ? req.query.page : 1;
                    let rows = 5;
                    let totalPage = Math.ceil(total / rows);
                    if (page > 1 && page > totalPage) {
                        let err = new Error('Not Found');
                        err.status = 404;
                        next(err);
                    } else {
                        Article.find({category: document._id})
                            .where({'delete_at': null})
                            .skip((page - 1) * 2).limit(rows)
                            .sort({'create_at': 'desc'})
                            .then(document => {
                                document.forEach((data) => {
                                    if (data.img) {
                                        data.img = static(data.img);
                                    }
                                    let contents = trimHtml(data.contents, {
                                        limit: 1,
                                        preserveTags: false,
                                        sufix: '...'
                                    });
                                    data.contents = contents.html;
                                })
                                res.render('list', {
                                        'list': document,
                                        'page': page,
                                        'rows': 'rows',
                                        'totalPage': totalPage,
                                        'total': total
                                    }
                                );
                            });
                    }
                });
            }
        });
    }
}

module.exports = Home;