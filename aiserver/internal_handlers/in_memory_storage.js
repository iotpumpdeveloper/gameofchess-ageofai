/**
 * get data from the in memory storage
 */
module.exports = 
 async (context) => {
    var db = context.db;
    var storage = db.getInMemoryStorage();
    return storage;
  }
