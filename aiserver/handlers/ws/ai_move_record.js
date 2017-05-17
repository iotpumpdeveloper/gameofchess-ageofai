/**
 * record the move that ai made for a specific fen
 */
module.exports = 
  async (context) => {
    var fenKey = context.client.dk;
    var db = context.db;
    var move = context.client.data.move;
    await db.saveEntry('experience', fenKey, JSON.stringify(move));
    return {
      success : true,
    };
  }
