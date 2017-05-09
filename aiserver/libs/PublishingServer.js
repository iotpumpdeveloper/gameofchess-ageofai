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
  }

  start() 
  {
    //TODO...
    //start the server
    super.start();

  }
}
