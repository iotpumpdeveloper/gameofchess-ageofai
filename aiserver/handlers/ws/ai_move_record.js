/**
 * record the move that ai made for a specific fen
 */
module.exports = 
  async (context, client) => {
    var fenKey = client.dk;
    var db = context.db;
    var move = client.data.move;
    await db.saveEntry('experience', fenKey, JSON.stringify(move));
    client.endJSON({
      success : true,
    });
  }
