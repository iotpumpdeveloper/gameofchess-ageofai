/**
 * record the move that ai made for a specific fen
 */
module.exports = 
  async (context, client) => {
    var querystring = require('querystring');
    var messageObj = JSON.parse(client.message);
    var fen = messageObj.fen;
    var move = messageObj.move;
    if (typeof fen == 'string' && fen.length > 0) {
      var fenKey = querystring.escape(fen);

      try {
        context 
          .distributor
          .onSettle( async () => {
            var db = context.db;
            await db.saveEntry('experience', fenKey, JSON.stringify(move));
            client.endJSON({
              success : true,
            });
          })
          .distribute(client, fenKey);
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
