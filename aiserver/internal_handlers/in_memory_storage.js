/**
 * get data from the in memory storage
 */
module.exports = 
 (context) => {
    var db = context.db;
    var storage = db.getInMemoryStorage();
    return storage;
  }
