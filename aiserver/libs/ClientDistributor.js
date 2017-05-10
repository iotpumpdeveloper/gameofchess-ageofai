const KeyDistributor = require('./KeyDistributor');
const WebSocketClient = require('./WebSocketClient');
const Config = require('./Config');

/**
 * The client distributor
 * Responsible for distributing clients across different servers based on a given key
 */
module.exports = 
  class ClientDistributor
{

  constructor()
  {
    this.KeyDistributor = new KeyDistributor();
  }

  async distribute(client, key)
  {
    var config = Config.get();
    var serverName = this.KeyDistributor.getServerNameForKey(key);
    if (serverName == config.currentServerName) { //this client is settled on the current server
      this.onSettleCallback();
    } else {
      var message = await this._forwardClientToServer(client, serverName);
      client.sendMessage(message);
      client.close(); //close the client after sending the message, maybe we can have a config option later for this?
    }
  }

  _forwardClientToServer(client, serverName)
  {
    return new Promise( (resolve, reject) => {
      var config = Config.get();
      var serverInfo = config.servers[serverName];
      var _ws = new WebSocketClient(serverInfo, this.upgradeReq.url).connect();
      _ws.on('open', () => {
        _ws.send(client.message, (err) => {
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

  /**
   * this is called if the client forwarding is settled
   */
  onSettle(callback)
  {
    this.onSettleCallback = callback;
    return this;
  }

}
