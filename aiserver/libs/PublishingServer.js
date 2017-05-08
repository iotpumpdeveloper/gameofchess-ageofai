/**
 * The Publishing Server
 * Responsible to "publish" an AI game move to the the broadcasting servers
 */

const WebSocketServer = require('./WebSocketServer');
const WebSocketClient = require('./WebSocketClient');
const InternalDataPathName = require('./InternalDataPathName');
const Path = require('./Path');
const Config = require('./Config');
const Chess = require('./chess.js').Chess;
const SimpleAI = require('./SimpleAI.js'); 

module.exports=
class PublishingServer extends WebSocketServer
{
  constructor(serverName)
  {
    var config = Config.get();

    super(config.servers[serverName]);

    this.config = config;
    this.serverName = serverName;

    this.game = new Chess();
  }

  start() 
  {
    var config = this.config;
    //maintain a list of web sockets connecting to each broadcasting server's idp
    //and keep them alived
    var broadcastors = [];
    var noop = () => {};

    var initBroadcastors = ()=> {
      for (var serverName in config.servers) {
        if (serverName != this.serverName) { //broadcasting servers 
          if (broadcastors[serverName] == undefined 
            || broadcastors[serverName].readyState == 3) {
            broadcastors[serverName] = new WebSocketClient(
              config.servers[serverName], 
              InternalDataPathName.onServer(serverName)
            ).connect();
            broadcastors[serverName].on('error', noop);
          }
        }
      }
      this.broadcastors = broadcastors;
      setTimeout(initBroadcastors, 3000);
    };

    initBroadcastors();

    this.startPublishMove();

    //start the server
    super.start();

  }
}
