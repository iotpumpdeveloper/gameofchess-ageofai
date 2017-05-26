var StockFish = require('stockfish');
var Chess = require(__dirname + '/../libs/chess.js').Chess;

class StockFishChessAI
{
  constructor()
  {
    this.game = new Chess();
    this.stockfish = new StockFish();
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
            promotion: match[3]
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

var ai = new StockFishChessAI();
(async () => {
  for (var i = 1; i <= 100; i++) {
    console.log(i);
    var game = ai.getCurrentGame();

    if (game.moves().length == 0) {
      console.log('Game over');
      console.log(game.turn() + ' lost');
      break;
    } else if (game.in_stalemate() ) {
      console.log('Stale Mate');
      break;
    }

    //player move first, in white
    var moves = game.ugly_moves(); 
    var move = moves[Math.floor(Math.random() * moves.length)]; //player just do a random move
    game.ugly_move(move);

    //ai move 
    var move = await ai.getNextBestMove(3);
    game.move(move);
  }
})();
