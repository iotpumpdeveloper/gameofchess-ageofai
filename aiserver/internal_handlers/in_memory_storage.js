/**
 * get data from the in memory storage
 */
module.exports = 
  async (context) => {
    var messageObj = JSON.parse(context.client.message);
     
    var db = context.db;
    var storage = db.getInMemoryStorage();

    var result = {};
    var set_name = messageObj.set_name;
    if (messageObj.set_name === '*') {
      result = storage; 
    } else if (storage[set_name] !== undefined) {
      result = storage[set_name];
    }
    return {
      success : true,
      data : result 
    };
  }
