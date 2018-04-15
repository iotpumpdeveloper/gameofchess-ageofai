/**
 * get the next ai move
 */

module.exports =
  async (context) => {
    var fenKey = context.client.dk;
    var db = context.db;
    var moveJSON = await db.getEntry('experience', fenKey);
    if (moveJSON !== undefined) {
      console.log("reading fenKey " + fenKey + " from server " + context.config.currentServerName);
      return {
        success : true,
        moveJSON : moveJSON
      };
    } else {
      return {
        success : false
      };
    }
  }
