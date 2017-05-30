const StockFish = require('stockfish');
const Chess = require(__dirname + '/../libs/chess.js').Chess;

module.exports=
class StockFishChessAI
{
  constructor()
  {
    this.game = new Chess();
    this.stockfish = new StockFish();
    this.stockfish.onmessage = () => {}; //this is very interesting, we need to set an empty onmessage handler here
  }

  getCurrentGame()
  {
    return this.game;
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
          var move = {
            from: match[1], 
            to: match[2], 
            promotion: match[3],
            engine:'stockfish'
          }
          resolve(move);
        }
      };

      //console.log(this._getHistoricalMoves());
      this.stockfish.postMessage('position startpos moves' + this._getHistoricalMoves());
      this.stockfish.postMessage("go depth " + depth);
    });
  }
}

