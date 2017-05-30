require('events').EventEmitter.prototype._maxListeners = 1000;//set 1000 listeners

const querystring = require("querystring");
const fs = require('fs');
const KeyDistributor = require(__dirname + '/../libs/KeyDistributor.js');
const Config = require(__dirname + '/../libs/Config.js');
const StockFishChessAI = require(__dirname + '/../libs/StockFishChessAI.js');

Config.init(__dirname + '/' + '../../aiserver/config.json');
var kd = new KeyDistributor();

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

  var firstMoves = [];

  for (k = 1; k <= 500; k++) {
    firstMoves = firstMoves.concat(game.ugly_moves());
  }

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
