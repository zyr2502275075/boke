const AuthMiddleware = (req, res, next) => {
    if (req.session.user) {  //判断用户是否登录
        next();
    } else {
        req.session.originalUrl = req.originalUrl ? req.originalUrl : null;
        req.flash('error', '请您先登录后在进行操作！');
        res.redirect('/users/login');
    }
}
module.exports = AuthMiddleware;
