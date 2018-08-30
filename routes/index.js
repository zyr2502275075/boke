const express = require('express');
const router = express.Router();
const home = require('../controllers/home');

/**
 * 首页路由
 */
router.get('/', home.index);
router.get('/:path', home.category);

module.exports = router;
