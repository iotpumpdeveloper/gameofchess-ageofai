function get_moves()
{
  var moves = '';
  var history = game.history({verbose: true});

  for(var i = 0; i < history.length; ++i) {
    var move = history[i];
    moves += ' ' + move.from + move.to + (move.promotion ? move.promotion : '');
  }

  return moves;
}

var Chess = require('chess.js').Chess;

var StockFish = require('stockfish');

var stockfish = StockFish();

var game = new Chess();

stockfish.postMessage("uci");
stockfish.postMessage('position startpos moves' + get_moves());
stockfish.postMessage("go depth 3");

stockfish.onmessage = function(event) {
  var data = event.data ? event.data : event;
  var match = data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/); //find the best move 
  if (match !== null && typeof match === 'object') {
    console.log(match);
  }
};
