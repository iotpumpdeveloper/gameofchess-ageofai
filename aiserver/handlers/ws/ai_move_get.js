module.exports = 
  (context, client) => {
    var querystring = require('querystring');
    var fs = require('fs');
    var fen = context.message;
    if (typeof fen == 'string' && fen.length > 0) {
      var fenKey = querystring.escape(fen);
      var fenKeyEntry =  context.rootDir + '/../' + context.config.experienceDBDir + '/' + fenKey;
      fs.access(fenKeyEntry, (err) => {
        if (!err) { //fen key entry exists
          var moveJSON = fs.readFileSync(fenKeyEntry).toString().trim();
          client.sendJSON({
            success : true,
            moveJSON : moveJSON
          });
        } else {
          client.sendJSON({
            success : false
          }); 
        }
        client.close();
      });
    } else {
      client.sendJSON({
        success : false
      }); 
      client.close();
    }
  }
