var SimpleChessAI = require(__dirname + '/../libs/SimpleChessAI.js'); 

var args = process.argv;

if (args[2] == undefined) {
  console.log('Please provide the fen string');
  process.exit();
}

var fen = args[2].trim();

var move = SimpleChessAI.getNextBestMove(fen);
console.log(move);
