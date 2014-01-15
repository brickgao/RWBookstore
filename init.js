var settings = require('./settings'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(settings.db),
    crypto = require('crypto'),
    md5 = crypto.createHash('md5'),
    passwd = md5.update('admin').digest('hex');

db.serialize(function() {
  db.run("CREATE TABLE user(username text primary key, passwd text, isadmin integer)");
  db.run("CREATE TABLE book(bookname text primary key, bookinfo text, price text)");

  var stmt = db.prepare("INSERT INTO user(username, passwd, isadmin) values(?, ?, ?)");
  stmt.run('admin', passwd, 1)
  stmt.finalize();
  
});

db.close();
