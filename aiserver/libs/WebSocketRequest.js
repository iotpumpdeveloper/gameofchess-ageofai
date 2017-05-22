const Config = require('../libs/Config');
const WebSocketClient = require('../libs/WebSocketClient');

/**
 * a websocket request 
 */
module.exports =
  class WebSocketRequest
{
  constructor(serverName, path)
  {
    this.serverName = serverName;
    this.path = path;
    this.config = Config.get();
  }

  send(message)
  {
    if (typeof message === 'object') { //if the message is an object, make it a json 
      message = JSON.stringify(message);
    }

    return new Promise( (resolve, reject) => {
      var _ws = new WebSocketClient(this.config.servers[this.serverName], this.path).connect();
      _ws.on('open', () => {
        _ws.send(message, (err) => {
          if (err) { //message is not sent
            console.log(err);
            reject(err); 
          }
        });
      });
      _ws.on('message', (msg) => {
        resolve(msg); 
        //now close the websocket 
        _ws.close();
      });
    });
  }
}
