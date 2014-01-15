module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('index', {
      title: '主页',
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      isadmin: req.session.isadmin,
      user: req.session.user
    });
  });
  
  app.get('/reg', function(req, res) {
    if(req.session.user) {
      req.flash('error', '你已经登录，请先退出');
      return res.redirect('back');
    }
    res.render('reg', {
      title: '注册',
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      isadmin: req.session.isadmin,
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

  app.get('/login', function(req, res) {
    if(req.session.user) {
      req.flash('error', '你已经登录，请先退出');
      return res.redirect('back');
    }
    res.render('login', {
      title: '登录',
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      isadmin: req.session.isadmin,
      user: req.session.user
    });
  });

  app.post('/login', function(req, res) {
    var username = req.body.username,
        passwd = req.body.passwd;
    if(username === '') {
      req.flash('error', '请填写用户名');
      return res.redirect('/login');
    }
    if(passwd === '') {
      req.flash('error', '请填写密码');
      return res.redirect('/login');
    }
    var user = require('../models/user.js');
    var userInfo = new user(username, passwd, '', 0);
    userInfo.check(function(err, flag, isadmin) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/login');
      }
      else {
        if(!flag) {
          req.flash('error', '密码错误或者用户名不存在');
          return res.redirect('/login');
        }
        else {
          req.session.user = username;
          req.session.isadmin = isadmin;
          req.flash('success', '欢迎回来，' + username);
          return res.redirect('/');
        }
      }
    });
  });

  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.session.isadmin = null;
    req.flash('success', '你已经退出');
    res.redirect('/');
  });

}
