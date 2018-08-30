const express = require('express');
const router = express.Router();
const category = require('../controllers/category');

/**
 * 分类路由
 */
router.get('/index', category.index);
router.get('/:id', category.get);
router.post('/save', category.save);
router.post('/update/:id', category.update);
router.get('/delete/:id', category.delete);
router.get('/is_nav/:id/:is_nav', category.setNav);

module.exports = router;
