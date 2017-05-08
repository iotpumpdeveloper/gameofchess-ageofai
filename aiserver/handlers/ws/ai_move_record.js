/**
 * record the move that ai made for a specific fen
 */
module.exports = 
  async (context, client) => {
    var querystring = require('querystring');
    var fs = require(__dirname + '/../../libs/FileSystem.js');
    var messageObj = JSON.parse(context.message);
    var fen = messageObj.fen;
    var move = messageObj.move;
    if (typeof fen == 'string' && fen.length > 0) {
      var fenKey = querystring.escape(fen);
      var fenKeyEntry =  context.rootDir + '/../' + context.config.experienceDBDir + '/' + fenKey;
      try {
        if (await fs.exists(fenKeyEntry)) { //fen key entry exists, do not record anything
          client.endJSON({
            success : false,
          });
        } else {
          console.log("recording move for fenKey " + fenKey);
          await fs.writeFile(fenKeyEntry, JSON.stringify(move)); 
          context.storage.experience[fenKey] = JSON.stringify(move); //store move in in-memory experience storage
          client.endJSON({
            success : true,
          });
        }
      } catch (err) {
        console.log(err);
        client.endJSON({
          success : false,
        });
      }
    } else {
      client.endJSON({
        success : false
      }); 
    }
  }
