/**
 * get the next ai move
 */

module.exports = 
async (context, client) => {
    var querystring = require('querystring');
    var fs = require(__dirname + '/../../libs/FileSystem.js');
    var fen = context.message;
    if (typeof fen == 'string' && fen.length > 0) {
      var fenKey = querystring.escape(fen);

      this
        .distributor
        .distribute(client, fenKey)
        .onSettle( () => {
          var db = context.db;
          var moveJSON = db.getEntry('experience', fenKey);
          if (moveJSON != undefined) {
            console.log("reading fenKey " + fenKey + " from memory");
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
    } else {
      client.endJSON({
        success : false
      }); 
    }
}
