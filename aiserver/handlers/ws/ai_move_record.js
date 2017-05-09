/**
 * record the move that ai made for a specific fen
 */
module.exports = 
  async (context, client) => {
    var querystring = require('querystring');
    var messageObj = JSON.parse(context.message);
    var fen = messageObj.fen;
    var move = messageObj.move;
    if (typeof fen == 'string' && fen.length > 0) {
      var fenKey = querystring.escape(fen);
      var db = context.dbFactory.getInstanceForKey(fenKey);
      try {
        context.db.saveEntry('experience', fenKey, JSON.stringify(move));
        client.endJSON({
          success : true,
        });
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
