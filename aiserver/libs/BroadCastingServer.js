const WebSocketServer = require('./WebSocketServer');
const WebSocketClient = require('./WebSocketClient');
const Path = require('./Path');
const Config = require('./Config');
const InternalDataPathName = require('./InternalDataPathName');

module.exports = 
class BroadCastingServer extends WebSocketServer
{
  constructor(serverName)
  {
    var config = Config.get();
   
    super(config.servers[serverName]);

    this.config = config;

    this.serverName = serverName;

    this.storage = {}; //initiate an in-server storage
    this.storage.experience = {}; //storage the experience (fen => move pairs)
  }

  start()
  {
    //map application routes
    var routes = this.config.routes;
    for (var path in this.config.routes) {
      this
        .addPath(path)
        .getDefaultChannel()
        .onMessage = (message, client) => {
          var context = {};
          context.message = message;
          context.client = client;
          context.config = this.config;
          context.rootDir = __dirname + '/..';
          context.storage = this.storage;
          var handler = require(context.rootDir + '/handlers/' + routes[client.path.path]);
          handler(context, client);
        }
    }

    //add internal data path
    var idpName = InternalDataPathName.onServer(this.serverName); 
    this
      .addPath(idpName)
      .getDefaultChannel()
      .onMessage = (message) => { //now there is incoming message on idp of this server
        var messageObj = JSON.parse(message);
        console.log(messageObj);
      }

    super.start(); //start the web server
  }
}
