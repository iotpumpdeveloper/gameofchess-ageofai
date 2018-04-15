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

  /**
   * this is called if the client forwarding is settled
   */
  onSettle(callback)
  {
    this.onSettleCallback = callback;
    return this;
  }

  async distribute(client, key)
  {
    if ( (typeof key !== 'string') || ! (key.length > 0) ) { //we have an invalid key, just settle the distribution
      this.onSettleCallback();
      return;
    }
    var config = Config.get();
    var serverName = this.KeyDistributor.getServerNameForKey(key);
    if (serverName === config.currentServerName) { //this client is settled on the current server
      this.onSettleCallback();
    } else {
      var message = await this._forwardClientToServer(client, serverName);
      client.send(message);
    }
  }

  _forwardClientToServer(client, serverName)
  {
    return new Promise( (resolve, reject) => {
      var config = Config.get();
      var serverInfo = config.servers[serverName];
      //initiate a forwarding websocket
      var _ws = new WebSocketClient(serverInfo, client.upgradeReq.url).connect();
      _ws.on('open', () => {
        _ws.send(client.message, (err) => {
          if (err) { //message is not sent
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
