/**
 * define some functions and variable to allow isomorphic javascript
 */
const require = (scriptName) => {
  self.importScripts(scriptName);
}

var module = {};

require('./SimpleChessAI.js');
self.addEventListener('message', (e) => {
  var fen = e.data;
  var move = self.getNextBestMove(fen);
  self.postMessage( JSON.stringify(move) );
}, false);
