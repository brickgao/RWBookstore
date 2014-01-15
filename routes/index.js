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

  app.get('/manage', function(req, res) {
    if(!req.session.user) {
      req.flash('error', '请先登录');
      return res.redirect('/login');
    }
    if(req.session.isadmin === 0) {
      req.flash('error', '你没有相应的权限');
      return res.redirect('/');
    }
    var book = new require('../models/book.js'),
        bookInfo = new book();
    bookInfo.getAllBook(function(err, row) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('manage', {
        title: '管理图书',
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        isadmin: req.session.isadmin,
        user: req.session.user,
        row: row
      });
    });
  });

  app.get('/manage/add', function(req, res) {
    if(!req.session.user) {
      req.flash('error', '请先登录');
      return res.redirect('/login');
    }
    if(req.session.isadmin === 0) {
      req.flash('error', '你没有相应的权限');
      return res.redirect('/');
    }
    var book = new require('../models/book.js'),
        bookInfo = new book();
    res.render('add', {
      title: '增加图书',
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      isadmin: req.session.isadmin,
      user: req.session.user
    });
  });

  app.post('/manage/add', function(req, res) {
    if(!req.session.user) {
      req.flash('error', '请先登录');
      return res.redirect('/login');
    }
    if(req.session.isadmin === 0) {
      req.flash('error', '你没有相应的权限');
      return res.redirect('/');
    }
    var bookname = req.body.bookname,
        bookinfo = req.body.bookinfo,
        price = req.body.price,
        book = new require('../models/book.js'),
        bookInfo = new book();
    if(bookname === '') {
      req.flash('error', '图书名称不可为空');
      return res.redirect('/manage/add');
    }
    if(isNaN(price) || price === '') {
      req.flash('error', '图书价格不合法');
      return res.redirect('/manage/add');
    }
    bookInfo.addBook(bookname, bookinfo, price, function(err) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/manage');
      }
      else {
        req.flash('success', '添加成功');
        return res.redirect('/manage');
      }
    });
  });

  app.get('/manage/:id', function(req, res) {
    if(!req.session.user) {
      req.flash('error', '请先登录');
      return res.redirect('/login');
    }
    if(req.session.isadmin === 0) {
      req.flash('error', '你没有相应的权限');
      return res.redirect('/');
    }
    var book = new require('../models/book.js'),
        bookInfo = new book();
    bookInfo.getAllBook(function(err, row) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('edit', {
        title: '管理图书',
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        isadmin: req.session.isadmin,
        user: req.session.user,
        row: row[parseInt(req.params.id)]
      });
    });
  });

  app.post('/manage/:id', function(req, res) {
    if(!req.session.user) {
      req.flash('error', '请先登录');
      return res.redirect('/login');
    }
    if(req.session.isadmin === 0) {
      req.flash('error', '你没有相应的权限');
      return res.redirect('/');
    }
    var book = new require('../models/book.js'),
        bookInfo = new book();
    bookInfo.getAllBook(function(err, row) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      var bookname = row[parseInt(req.params.id)].bookname,
          bookinfo = req.body.bookinfo,
          price = req.body.price;
      if(isNaN(price) || price === '') {
        req.flash('error', '图书价格不合法');
        return res.redirect('/manage/' + req.params.id);
      }
      bookInfo.editBook(bookname, bookinfo, price, function(err) {
        if(err) {
          req.flash('error', err);
          return res.redirect('/manage');
        }
        else {
          req.flash('success', '修改成功');
          return res.redirect('/manage');
        }
      });
    });
  });

  app.get('/manage/del/:id', function(req, res) {
    if(!req.session.user) {
      req.flash('error', '请先登录');
      return res.redirect('/login');
    }
    if(req.session.isadmin === 0) {
      req.flash('error', '你没有相应的权限');
      return res.redirect('/');
    }
    var book = new require('../models/book.js'),
        bookInfo = new book();
    bookInfo.getAllBook(function(err, row) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      var bookname = row[parseInt(req.params.id)].bookname;
      bookInfo.delBook(bookname, function(err) {
        if(err) {
          req.flash('error', err);
          return res.redirect('/manage');
        }
        else {
          req.flash('success', '删除成功');
          return res.redirect('/manage');
        }
      });
    });
  });

  app.get('/list', function(req, res) {
    if(!req.session.user) {
      req.flash('error', '请先登录');
      return res.redirect('/login');
    }
    var book = new require('../models/book.js'),
        bookInfo = new book();
    bookInfo.getAllBook(function(err, row) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('list', {
        title: '图书列表',
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        isadmin: req.session.isadmin,
        user: req.session.user,
        row: row
      });
    });
  });
  
  app.get('/list/:id', function(req, res) {
    if(!req.session.user) {
      req.flash('error', '请先登录');
      return res.redirect('/login');
    }
    var book = new require('../models/book.js'),
        bookInfo = new book();
    bookInfo.getAllBook(function(err, row) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/list');
      }
      res.render('bookItem', {
        title: '图书详情' + row[parseInt(req.params.id)].bookname,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        isadmin: req.session.isadmin,
        user: req.session.user,
        row: row[parseInt(req.params.id)]
      });
    });
  });

}
