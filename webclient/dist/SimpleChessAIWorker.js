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
  self.postMessage( JSON.stringify(move) );
}, false);
