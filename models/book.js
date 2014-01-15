var settings = require('../settings'),
    sqlite3 = require('sqlite3').verbose();

function book() {
}

module.exports = book;

book.prototype.getAllBook = function getAllBook(callback) {
  var db = new sqlite3.Database(settings.db);
  db.all("SELECT * FROM book", function(err, row) {
    if(err) {
      db.close();
      return callback(err, null);
    }
    else {
      db.close();
      return callback(err, row);
    }
  })
}

book.prototype.addBook = function addBook(bookname, bookinfo, price, callback) {
  var db = new sqlite3.Database(settings.db);
  db.get("SELECT * FROM book WHERE bookname = ?", bookname, function(err, row) {
    if(err) {
      db.close();
      return callback(err);
    }
    else if(row) {
      db.close();
      return callback('同名书目已存在');
    }
    else {
      db.run("INSERT INTO book(bookname, bookinfo, price) values(?, ?, ?)", bookname, bookinfo, price, function(err) {
        db.close();
        if(err)
          return callback(err);
        else
          return callback(null);
      });
    }
  })
}

book.prototype.editBook = function editBook(bookname, bookinfo, price, callback) {
  var db = new sqlite3.Database(settings.db);
  db.get("SELECT * FROM book WHERE bookname = ?", bookname, function(err, row) {
    if(err) {
      db.close();
      return callback(err);
    }
    else if(row) {
      db.run("UPDATE book SET bookinfo = ? AND price = ? WHERE bookname = ?", bookinfo, price, bookname, function(err) {
        db.close();
        if(err)
          return callback(err);
        else
          return callback(null);
      });
    }
  })
}

book.prototype.delBook = function delBook(bookname, callback) {
  var db = new sqlite3.Database(settings.db);
  db.run("DELETE FROM book WHERE bookname = ?", bookname, function(err) {
    db.close();
    if(err)
      return callback(err);
    else
      return callback(null);
  })
}
