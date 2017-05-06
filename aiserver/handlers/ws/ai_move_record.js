/**
 * record the move that ai made for a specific fen
 */
module.exports = 
  (context, client) => {
    var querystring = require('querystring');
    var fs = require('fs');
    var messageObj = JSON.parse(context.message);
    var fen = messageObj.fen;
    var move = messageObj.move;
    if (typeof fen == 'string' && fen.length > 0) {
      var fenKey = querystring.escape(fen);
      var fenKeyEntry =  context.rootDir + '/../' + context.config.experienceDBDir + '/' + fenKey;
      fs.access(fenKeyEntry, (err) => {
        if (!err) { //fen key entry exists, do not record anything
          client.sendJSON({
            success : false,
          });
          client.close();
        } else { //fen key entry does not exist yet, record it
          fs.writeFile(fenKeyEntry, JSON.stringify(move), (err) => {
            if (!err) {
              //successfully saved
              console.log('successfully record for fen key entry: ' + fenKeyEntry);
              client.sendJSON({
                success : true
              });
              client.close();
            } else {
              console.log(err);
              client.sendJSON({
                success : false
              }); 
              client.close();
            }
          }); 
        }
      });
    } else {
      client.sendJSON({
        success : false
      }); 
      client.close();
    }
  }
