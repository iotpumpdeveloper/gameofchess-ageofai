const ws = require('ws');

//add new methods to ws prototype 
ws.prototype.switchToChannel = function(channelName){
  this.path.getChannel(channelName).addClient(this);
}

ws.prototype.sendJSON = function(o) {
  this.send(JSON.stringify(o));
}

ws.prototype.endJSON = function(o) {
  this.send(JSON.stringify(o));
  this.close();
}

/**
 * forward a message to another server
 */
ws.prototype.forwardMessage = function(message, serverInfo) {
  return new Promise( (resolve, reject) => {
    var _ws = new WebSocketClient(serverInfo, this.upgradeReq.url).connect();
    _ws.on('open', () => {
      _ws.send(message, (err) => {
        if (err) { //message is not sent
          reject(err); 
        }
      });
    });
    _ws.on('message', (msg) => {
      resolve(msg); 
    });
  });
}

module.exports = 
  class WebSocketClient
{
  constructor(serverInfo, path)
  {
    this.serverInfo = serverInfo;
    this.path = path;
  }

  connect(options = {})
  {
    var webSocket;
    var wsUrl = 'ws://' + this.serverInfo.host 
      + ':' 
      + this.serverInfo.port 
      + this.path;

    webSocket = new ws(wsUrl, {
      perMessageDeflate: false
    });

    return webSocket;
  }

  static bindToWebSocket(webSocket)
  {
    return webSocket;
  }
}
