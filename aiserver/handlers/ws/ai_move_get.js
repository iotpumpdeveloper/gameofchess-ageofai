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
      if (context.storage.experience[fenKeyEntry] != undefined) {
        var moveJSON = context.storage.experience[fenKeyEntry];
        client.endJSON({
          success : true,
          moveJSON : moveJSON
        });
        return;
      }

      //fenKey not in experience yet, add to the move query queue 
      if (this.storage.mqm[fenKeyEntry] == undefined ) { //the fenKeyEntry is not in the messsage query map yet
        this.storage.mqq.push(fenKeyEntry);
        this.storage.mqm[fenKeyEntry] = 1;
      }
      client.endJSON({
        success : false
      }); 

      /*
      fs.access(fenKeyEntry, (err) => {
        if (!err) { //fen key entry exists
          var moveJSON = fs.readFileSync(fenKeyEntry).toString().trim();
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
      */
    } else {
      client.endJSON({
        success : false
      }); 
    }
  }
