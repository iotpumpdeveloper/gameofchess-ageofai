require('events').EventEmitter.prototype._maxListeners = 1000;//set 1000 listeners

const querystring = require("querystring");
const fs = require('fs');
const KeyDistributor = require(__dirname + '/../libs/KeyDistributor.js');
const Config = require(__dirname + '/../libs/Config.js');
const StockFishChessAI = require(__dirname + '/../libs/StockFishChessAI.js');

Config.init(__dirname + '/' + '../../aiserver/config.json');
var kd = new KeyDistributor();

var SQUARES = {
  a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
  a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
  a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
  a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
  a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
  a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
  a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
  a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};

var SQUARES_MAP = {}
for( var key in SQUARES ) {
  SQUARES_MAP[SQUARES[key]] = key;
}

function doMove(game, move, color)
{
  move.color = color;
  if (move.from >= 0 && move.from <= 119) {
    game.ugly_move(move); 
  } else {
    game.move(move); 
  }
}

function broadcastExperience(fen, move)
{
  var fenKey = querystring.escape(fen);
  var serverName = kd.getServerNameForKey(fenKey);
  var targetFile = __dirname + '/' + '../../db/' + serverName + '/experience/' + fenKey;
  fs.writeFileSync(targetFile, JSON.stringify(move));
}


//cover all possible first movies
(async () => {
  var ai = new StockFishChessAI();
  //get all possible first moves for player 
  var game = ai.getCurrentGame();

  var firstMoves = game.ugly_moves();  

  var gameNumber = 0;
  for (fmi = 0; fmi < firstMoves.length; fmi ++) { //fmi --- first move index 
    gameNumber ++;

    console.log('Game ' + gameNumber);

    console.log(1);
    var ai = new StockFishChessAI();
    var game = ai.getCurrentGame();
    //player move, in white
    var playerMove = firstMoves[fmi];
    doMove(game, playerMove, 'w');
    
    //ai move, in black
    var aiMove= await ai.getNextBestMove(10);
    broadcastExperience(game.fen(), aiMove);
    doMove(game, aiMove, 'b');
    
    for (var i = 2; i <= 100; i++) {
      console.log(i);
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
      var playerMove = moves[Math.floor(Math.random() * moves.length)]; //player just do a random move

      doMove(game, playerMove, 'w');

      //ai move 
      var aiMove = await ai.getNextBestMove(10);
      broadcastExperience(game.fen(), aiMove); 
      doMove(game, aiMove, 'b');

    }
  }
})();
