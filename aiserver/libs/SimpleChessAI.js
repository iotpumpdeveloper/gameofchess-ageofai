/**
 * modified from : 
 * https://medium.freecodecamp.com/simple-chess-ai-step-by-step-1d55a9266977
 */
var c = require('./chess.js');

/**
 * since this is an isomorphic library, need to deal with backend and frontend difference on requiring
 */
var Chess;
if (typeof c.Chess === 'function') {
  Chess = c.Chess;
} else if (typeof c === 'function') {
  Chess = c;
}

var colorMap = {
  'black' : 'b',
  'white' : 'w',
  'b' : 'b',
  'w' : 'w'
}
var aiColor = 'b'; //default ai is on black

var game = new Chess(); //initiate the game once

var setAIColor = function(color) {
  aiColor = colorMap[color]; 
}

var getAIColor = function() {
  if (aiColor == 'b') {
    return 'black';
  } else if (aiColor == 'w') {
    return 'white';
  }
}

var minimaxRoot =function(depth, game, isMaximisingPlayer) {

  var minimaxFunctionMap = {
    3 : minimax3,
    2 : minimax2,
    1 : minimax1,
    0 : minimax0
  }

  var newGameMoves = game.ugly_moves();
  var bestMove = -9999;
  var bestMoveFound;

  for(var i = 0; i < newGameMoves.length; i++) {
    var newGameMove = newGameMoves[i]
    game.ugly_move(newGameMove);
    var value = minimaxFunctionMap[depth - 1](game, -10000, 10000, !isMaximisingPlayer);
    game.undo();
    if(value >= bestMove) {
      bestMove = value;
      bestMoveFound = newGameMove;
    }
  }
  return bestMoveFound;
};

var minimax3 = function (game, alpha, beta, isMaximisingPlayer) {
  var newGameMoves = game.ugly_moves();

  if (isMaximisingPlayer) {
    var bestMove = -9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.max(bestMove, minimax2(game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      alpha = Math.max(alpha, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  } else {
    var bestMove = 9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.min(bestMove, minimax2(game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  }
};

var minimax2 = function (game, alpha, beta, isMaximisingPlayer) {
  var newGameMoves = game.ugly_moves();

  if (isMaximisingPlayer) {
    var bestMove = -9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.max(bestMove, minimax1(game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      alpha = Math.max(alpha, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  } else {
    var bestMove = 9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.min(bestMove, minimax1(game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  }
};


var minimax1 = function (game, alpha, beta, isMaximisingPlayer) {
  var newGameMoves = game.ugly_moves();

  if (isMaximisingPlayer) {
    var bestMove = -9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.max(bestMove, minimax0(game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      alpha = Math.max(alpha, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  } else {
    var bestMove = 9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.min(bestMove, minimax0(game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  }
};


var minimax0 = function (game, alpha, beta, isMaximisingPlayer) {
  return -evaluateBoard(game.board());
};

var evaluateBoard = function (board) {
  var totalEvaluation = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
    }
  }
  return totalEvaluation;
};

var reverseArray = function(array) {
  return array.slice().reverse();
};

var pawnEvalWhite =
  [
    [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
    [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
    [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
    [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
    [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
    [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
    [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
  ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
  [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
    [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
    [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
    [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
    [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
    [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
  ];

var bishopEvalWhite = [
  [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
  [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
  [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
  [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
  [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
  [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
  [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
  [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
  [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
  [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);

var getAbsoluteValue = function (piece, isWhite, x ,y) {
  if (piece.type === 'p') {
    return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
  } else if (piece.type === 'r') {
    return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
  } else if (piece.type === 'n') {
    return 30 + knightEval[y][x];
  } else if (piece.type === 'b') {
    return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
  } else if (piece.type === 'q') {
    return 90 + evalQueen[y][x];
  } else if (piece.type === 'k') {
    return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
  }
};

var getPieceValue = function (piece, x, y) {
  if (piece === null) {
    return 0;
  }

  var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
  return piece.color === aiColor ? -absoluteValue : absoluteValue;
};

var getNextBestMove = function(fen) {
  game.load(fen);
  setAIColor(game.turn());
  return minimaxRoot(3, game, true);
}

module.exports = {
  getNextBestMove
}
