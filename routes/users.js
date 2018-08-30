const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const auth = require('../middleware/auth');

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', user.login);
router.get('/logout', auth, user.logout);
router.get('/personal', auth, user.personal);
router.post('/personal', auth, user.update);
router.post('/password', auth, user.password);

module.exports = router;
