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

  app.post('/req', function(req, res) {
  });
}
