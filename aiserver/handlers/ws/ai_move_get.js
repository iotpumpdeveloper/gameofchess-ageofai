/**
 * get the next ai move
 */

module.exports = 
  async (context, client) => {
    var key = (client) => {
      var querystring = require('querystring');
      var fen = client.data.fen;
      if (typeof fen == 'string' && fen.length > 0) {
        var k = querystring.escape(fen);
        return k;
      }
    }

    client.dk = key(client); //dk stands for distribution key
    
    try {
      context
        .distributor
        .onSettle( async () => {
          
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

        })
        .distribute(client, client.dk)
    } catch (err) {
      console.log(err);
      client.endJSON({
        success : false
      }); 
    }
  }
