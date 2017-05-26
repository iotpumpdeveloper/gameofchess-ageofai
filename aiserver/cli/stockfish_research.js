var StockFish = require('stockfish');
var Chess = require('chess.js').Chess;

class StockFishChessAI
{
  constructor()
  {
    this.game = new Chess();
    this.stockfish = new StockFish();
  }

  _getHistoricalMoves()
  {
    var moves = '';
    var history = this.game.history({verbose: true});

    for(var i = 0; i < history.length; ++i) {
      var move = history[i];
      moves += ' ' + move.from + move.to + (move.promotion ? move.promotion : '');
    }

    return moves;
  }

  getNextBestMove(depth)
  {
    return new Promise( (resolve, reject) => {
      this.stockfish.onmessage = function(event) {
        var data = event.data ? event.data : event;
        var match = data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/); //find the best move 
        if (match !== null && typeof match === 'object') {
          resolve(match);
        }
      };

      this.stockfish.postMessage('position startpos moves' + this._getHistoricalMoves());
      this.stockfish.postMessage("go depth " + depth);
    });
  }
}

var ai = new StockFishChessAI();
(async () => {
  var data = await ai.getNextBestMove(3);
  console.log(data);
})();
