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

      this.initWS = () => {
        {
          this._ws = new WebSocketClient(this.config.servers[this.serverName], this.path).connect();
          this._ws.on('open', () => {
            this.messageSendingTickFunction();
          });

          this._ws.on('message', (msg) => {
            resolve(msg); 
            //now close the websocket 
            //this._ws.close();
          });
        }
      }

      this.messageSendingTickFunction = () => {
        //console.log(this._ws.readyState);
        if (this._ws.readyState == 1) {
          this._ws.send(message, (err) => {
            if (err) {
              console.log(err);
              reject(err);
            }
          });
        } else if (this._ws.readyState == 3) {
          this.initWS(); //websocket is closed, reconnect
        }
      }

      this.initWS();
      this.messageSendingTickFunction();

    });
  }
}
