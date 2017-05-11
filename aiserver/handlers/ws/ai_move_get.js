/**
 * get the next ai move
 */

module.exports = 
async (context, client) => {
    var querystring = require('querystring');
    var messageObj = JSON.parse(client.message);
    var fen = messageObj.fen;
    if (typeof fen == 'string' && fen.length > 0) {
      var fenKey = querystring.escape(fen);

      try {
        context
          .distributor
          .onSettle( async () => {
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
          })
          .distribute(client, fenKey)
      } catch (err) {
        console.log(err);
        client.endJSON({
          success : false
        }); 
      }
    } else {
      client.endJSON({
        success : false
      }); 
    }
}
