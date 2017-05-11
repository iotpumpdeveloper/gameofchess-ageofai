/**
 * get the next ai move
 */

module.exports = 
  async (context, client) => {
    var fenKey = client.dk;
    var db = context.db;
    var moveJSON = db.getEntry('experience', fenKey);
    if (moveJSON != undefined) {
      console.log("reading fenKey " + fenKey + " from memory on server " + context.config.currentServerName);
      client.endJSON({
        success : true,
        moveJSON : moveJSON
      });
    } else {
      client.endJSON({
        success : false
      }); 
    }
  }
