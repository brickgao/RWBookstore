module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('index', {
      title: '主页',
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      user: req.session.user
    });
  });
  
  app.get('/reg', function(req, res) {
    if(req.session.user) {
      req.flash('error', '你已经登录');
      return res.redirect('back');
    }
    res.render('reg', {
      title: '注册',
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      user: req.session.user
    });
  });

  app.post('/reg', function(req, res) {
    var username = req.body.username,
        passwd = req.body.passwd;
    if(username === '') {
      req.flash('error', '请填写用户名');
      return res.redirect('/reg');
    }
    if(passwd === '') {
      req.flash('error', '请填写密码');
      return res.redirect('/reg');
    }
    var user = require('../models/user.js');
    var userInfo = new user(username, passwd, '', 0);
    userInfo.reg(function(err) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      else {
        req.flash('success', '注册成功');
        return res.redirect('/');
      }
    });
  });
}
