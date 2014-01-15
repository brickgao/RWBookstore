var settings = require('../settings'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('../rwbookstore.db');

function user(username, passwd, isadmin) {
  this.username = username;
  this.passwd = passwd;
  this.isadmin = isadmin;
}

module.exports = user;

user.prototype.reg = function reg(callback) {
  var username = this.username,
      crypto = require('crypto'),
      md5 = crypto.createHash('md5'),
      passwd = md5.update(this.passwd).digest('hex'),
      isadmin = this.isadmin;
  db.get("SELECT * FROM user where username = ?", username, function(err, row) {
    if(err) {
      db.close();
      return callback(err);
    }
    else if(row) {
      db.close();
      return callback('该用户名已经注册');
    }
    else {
      db.run("INSERT INTO user(username, passwd, isadmin) values(?, ?, ?)", username, passwd, isadmin, function(err) {
        if(err) {
          db.close();
          return callback(err);
        }
        else {
          return callback(null);
        }
      })
    }
  })
}
