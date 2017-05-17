/**
 * test: 
 * given a fen string, return the next best move from AI
 */

var chai = require('chai');  
var expect = chai.expect;
var WebSocket = require('ws');

var fen = "rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq - 0 1";

try {
  var ws = new WebSocket('ws://localhost/ws/ai/move/get', {
    perMessageDeflate: false
  });

  ws.on('open', () => {
    ws.send(JSON.stringify({
      fen: fen 
    }));
  });

  ws.on('message', (data) => {
    var response = JSON.parse(data);
    expect(response.success).to.be.true;
    var move = JSON.parse(response.moveJSON);
    expect(move).to.have.ownProperty('color');
    expect(move).to.have.ownProperty('from');
    expect(move).to.have.ownProperty('to');
  });

  ws.on('error', (error) => {
    throw error;
  });
} catch (error) {
  console.log(error.message);
}
