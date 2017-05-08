/**
 * get the next ai move
 */

module.exports = 
  (context, client) => {
    var querystring = require('querystring');
    var fs = require('fs');
    var fen = context.message;
    if (typeof fen == 'string' && fen.length > 0) {
      var fenKey = querystring.escape(fen);
      var fenKeyEntry =  context.rootDir + '/../' + context.config.experienceDBDir + '/' + fenKey;

      //first, check if the fenKey exists in experience yet 
      if (context.storage.experience[fenKey] != undefined) {
        console.log("reading fenKey " + fenKey + " from memory");
        var moveJSON = context.storage.experience[fenKey];
        client.endJSON({
          success : true,
          moveJSON : moveJSON
        });
        return;
      }

      //fenkey does not exist in experience yet, try reading from the experience db
      fs.access(fenKeyEntry, (err) => {
        if (!err) { //fen key entry exists
          var moveJSON = fs.readFileSync(fenKeyEntry).toString().trim();
          //cache this experience to the in-memory storage
          context.storage.experience[fenKey] = moveJSON;
          client.endJSON({
            success : true,
            moveJSON : moveJSON
          });
        } else {
          client.endJSON({
            success : false
          }); 
        }
      });
    } else {
      client.endJSON({
        success : false
      }); 
    }
  }
