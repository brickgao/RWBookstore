var settings = require('../settings'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(settings.db);

function user(username, passwd, passwdchanged, isadmin) {
  this.username = username;
  this.passwd = passwd;
  this.passwdchanged = passwdchanged;
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
      //db.close();
      return callback(err);
    }
    else if(row) {
      //db.close();
      return callback('该用户名已经注册');
    }
    else {
      db.run("INSERT INTO user(username, passwd, isadmin) values(?, ?, ?)", username, passwd, isadmin, function(err) {
        if(err) {
          //db.close();
          return callback(err);
        }
        else {
          //db.close();
          return callback(null);
        }
      })
    }
  })
}

user.prototype.check = function check(callback) {
  var username = this.username,
      crypto = require('crypto'),
      md5 = crypto.createHash('md5'),
      passwd = md5.update(this.passwd).digest('hex'),
      isadmin = this.isadmin;
  db.get("SELECT * FROM user where username = ?", username, function(err, row) {
    if(err) {
      //db.close();
      return callback(err);
    }
    else {
      //db.close();
      if(row.passwd === passwd) {
        return callback(null, true);
      }
      else {
        return callback(null, false);
      }
    }
  })
}

user.prototype.update = function update(callback) {
  var username = this.username,
      crypto = require('crypto'),
      md5 = crypto.createHash('md5'),
      passwd = md5.update(this.passwd).digest('hex'),
      isadmin = this.isadmin,
      passwdchanged = md5.update(this.passwdchanged).digest('hex');
  db.get("SELECT * FROM user WHERE username = ?", username, function(err, row) {
    if(err) {
      //db.close();
      return callback(err);
    }
    else {
      if(row.passwd === passwd) {
        db.run("UPDATE user SET passwd = ? WHERE username = ?", passwdchanged, username, function(err) {
          if(err) {
            //db.close();
            return callback(err);
          }
          else  {
            //db.close();
            return callback(null);
          }
        });
      }
      else {
        return callback('原密码不正确');
      }
    }
  })
}
