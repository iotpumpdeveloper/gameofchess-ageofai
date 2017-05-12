var SimpleChessAI = require(__dirname + '/../../isomorphic/libs/SimpleChessAI.js'); 

var args = process.argv;
var fen = args[2].trim();

var move = SimpleChessAI.getNextBestMove(fen);
console.log(move);
