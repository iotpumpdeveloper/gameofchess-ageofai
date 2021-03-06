/**
 * This is a general websocket server
 */
const ws = require('ws');
const Path = require('./Path');
const WebSocketClient = require('./WebSocketClient');

module.exports=
class WebSocketServer
{
  /**
   * create a WebSocketServer
   */
  constructor(serverInfo)
  {
    this.host = serverInfo.host;
    this.port = serverInfo.port;

    //all the paths are here 
    this.paths = {};
  }

  addPath(path, options)
  {
    this.paths[path] = new Path(path, options);
    return this.paths[path];
  }

  getPath(path)
  {
    return this.paths[path];
  }

  //clear all the paths
  clearAllPaths()
  {
    this.paths = {}; 
  }

  //get all paths 
  getAllPaths()
  {
    return this.paths;
  }

  /**
   * start the server
   */
  start()
  {
    this._serverInstance = new ws.Server({
      perMessageDeflate: false,
      host: this.host,
      port: this.port
    });

    this._serverInstance.on('connection', (client) => {
      //look up existing paths 
      this.paths = this.getAllPaths();
      var path = client.upgradeReq.url;
      if (path in this.paths && client.readyState == client.OPEN) {
        this.paths[path].addConnectedClient(WebSocketClient.bindToWebSocket(client));
      } else { //all other clients are considered invalid, we just close them
        client.close(); 
      }
    });
  }

  /**
   * @TODO: stop the server
   */
  stop()
  {
    //this._serverInstance.close();
  }
}
