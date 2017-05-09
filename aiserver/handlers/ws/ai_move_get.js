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
      try {
        if (await fs.exists(fenKeyEntry)) {
          var moveJSON = await fs.readFile(fenKeyEntry);
          //cache this experience to the in-memory storage
          console.log("caching fenKey " + fenKey + " in memory");
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
      } catch(err) {
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
