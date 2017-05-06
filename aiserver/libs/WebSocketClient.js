const ws = require('ws');

//add new methods to ws prototype 
ws.prototype.switchToChannel = function(channelName){
  this.path.getChannel(channelName).addClient(this);
}

ws.prototype.sendJSON = function(o) {
  this.send(JSON.stringify(o));
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
