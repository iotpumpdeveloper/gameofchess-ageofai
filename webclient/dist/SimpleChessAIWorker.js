self.importScripts('./SimpleChessAI.js');
self.addEventListener('message', (e) => {
  var fen = e.data;
  var move = self.getNextBestMove(fen);
  self.postMessage( JSON.stringify(move) );
}, false);
