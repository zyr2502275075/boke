const Category = require('../models/category');
/**
 * 栏目控制器
 */
const CategoryController = {
    /**
     * 列表,pid是栏目的父id,path是管理的字段，options其他设置
     */
    index: (req, res, next) => {
        Category.find({pid: null}).populate({
            path: 'category',
            options: {sort: {'sort': 'desc'}}
        }).sort({'sort': 'desc'}).then(doc => {
            res.json({
                'status': 1,
                'result': doc
            });
        })
    },
    /**
     * 详情
     */
    get: (req, res, next) => {
        Category.findOne({_id: req.params.id}).then(doc => {
            res.json({
                'status': 1,
                'result': doc
            });
        })
    },
    /**
     * 保存
     */
    save: (req, res, next) => {
        let name = req.body.name;
        let path = req.body.path;
        let sort = req.body.sort;
        let is_nav = req.body.is_nav;
        let pid = req.body.pid ? req.body.pid : null;
        let template = req.body.template;
        let c = new Category({
            name: name,
            path: path,
            sort: sort,
            is_nav: 1,
            pid: pid,
            template: template,
            is_nav: is_nav
        });
        c.save().then(doc => {
            let id = doc._id;
            if (pid) {
                Category.findOne({_id: pid}).then(doc => {
                    if (doc) {
                        doc.category.push(id);
                        Category.update({_id: pid}, doc).then(doc => {
                            res.json({
                                'status': 1,
                                'msg': "保存成功"
                            });
                        })
                    }
                });
            } else {
                res.json({
                    'status': 1,
                    'msg': "保存成功"
                });
            }
        }).catch(err => {
            res.json({
                'status': 0,
                'msg': "保存失败！"
            });
        });

    },
    /**
     * 更新
     */
    update: (req, res, next) => {
        let id = req.params.id;
        let name = req.body.name;
        let path = req.body.path;
        let sort = req.body.sort;
        let is_nav = req.body.is_nav;
        let pid = req.body.pid ? req.body.pid : null;
        let template = req.body.template;
        Category.findOne({_id: id}).then(doc => {
            let category = doc;
            Category.update({_id: id,}, {
                name: name,
                path: path,
                sort: sort,
                pid: pid,
                template: template,
                is_nav: is_nav
            }).then(doc => {
                if (pid != category.pid) {
                    if (category.pid) {
                        //查找旧pid的分类信息
                        Category.findOne({_id: category.pid}).then(doc => {
                            //删除旧pid
                            doc.category.remove(id);
                            //更新旧pid
                            Category.update({_id: category.pid}, doc).then(doc => {
                                if (pid) {
                                    //查找新的pid分类信息
                                    Category.findOne({_id: pid}).then(doc => {
                                        //插入新的pid
                                        doc.category.push(id);
                                        //更新新的pid
                                        Category.update({_id: pid}, doc).then(doc => {
                                            res.json({
                                                'status': 1,
                                                'msg': "保存成功！"
                                            });
                                        });
                                    });
                                } else {
                                    res.json({
                                        'status': 1,
                                        'msg': "保存成功！"
                                    });
                                }
                            });
                        });
                    } else {
                        Category.findOne({_id: pid}).then(doc => {
                            doc.category.push(id);
                            Category.update({_id: pid}, doc).then(doc => {
                                res.json({
                                    'status': 1,
                                    'msg': "保存成功！"
                                });
                            });
                        });
                    }
                } else {
                    res.json({
                        'status': 1,
                        'msg': "保存成功！"
                    });
                }
            })
        });
    },
    /**
     * 删除
     */
    delete: (req, res, next) => {
        let id = req.params.id;
        Category.findOne({_id: id}).then(doc => {
            if (doc) {
                if (doc.pid) {
                    let pid = doc.pid;
                    Category.findOne({_id: pid}).then(doc => {
                        doc.category.remove(id);
                        console.log(doc);
                        Category.update({_id: pid}, doc).then(doc => {
                            Category.remove({_id: id}).then(doc => {
                                res.json({
                                    status: 1,
                                    msg: '删除成功！'
                                });
                            })
                        });
                    });
                } else {
                    Category.remove({_id: id}).then(doc => {
                        res.json({
                            status: 1,
                            msg: '删除成功！'
                        });
                    })
                }
            } else {
                res.json({
                    status: 0,
                    msg: '删除失败！'
                });
            }
        }).catch(err => {
            res.json({
                status: 0,
                msg: '删除失败！'
            });
        });
    },
    /**
     * 设置导航显示
     */
    setNav: (req, res, next) => {
        let id = req.params.id;
        let is_nav = parseInt(req.params.is_nav);
        Category.update({_id: id}, {is_nav: is_nav}).then(doc => {
            res.json({
                status: 1,
                msg: '设置成功！'
            });
        });
    }
}

module.exports = CategoryController;