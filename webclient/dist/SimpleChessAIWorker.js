/**
 * define some functions and variable to allow isomorphic javascript
 */

var scriptMap = {
  './chess.js' : './chess.js',
  './SimpleChessAI.js' : './SimpleChessAI.js',
}

const require = (scriptName) => {
  self.importScripts(scriptMap[scriptName]);
}

var module = {};

require('./SimpleChessAI.js');
self.addEventListener('message', (e) => {
  var fen = e.data;
  var move = self.getNextBestMove(fen);
  //send back the fen=>move pair 
  self.postMessage( JSON.stringify({
    fen : fen,
    move : move
  }) );
}, false);
