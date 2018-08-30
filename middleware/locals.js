const Category = require('../models/category');
const User = require('../models/user');
const Article = require('../models/article');
const static = require('../library/static');

const LocalsMiddleware = (req, res, next) => {
    res.locals.loginUser = req.session.user
    res.locals.searchVal = req.query.searchVal ? req.query.searchVal : '';
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    Category.find({delete_at: null}).where({is_nav: 1}).where({pid: null}).sort({sort: 'desc'}).then(document => {
        res.locals.path = req.path;
        res.locals.category = document;
        User.findOne({username: 'blog'}).then(document => {
            document.avatar = static( document.avatar);
            res.locals.user = document;
            Article.find({'delete_at': null, jing: 1}).limit(2).sort({'create_at': 'desc'}).then(document => {
                document.forEach((data) => {
                    if (data.img) {
                        data.img = static(data.img);
                    }
                });
                res.locals.articleJing = document;
                Article.find({'delete_at': null}).where('view').gt(0).limit(5).sort({
                    'view': 'desc',
                    'create_at': 'desc'
                }).then(document => {
                    document.forEach((data) => {
                        if (data.img) {
                            data.img = static(data.img);
                        }
                    });
                    res.locals.articleHot = document;
                    next();
                })
            })
        })
    });
}

module.exports = LocalsMiddleware;
