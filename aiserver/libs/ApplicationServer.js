const WebSocketServer = require('./WebSocketServer');
const WebSocketClient = require('./WebSocketClient');
const Path = require('./Path');
const Config = require('./Config');
const ClientDistributor = require('./ClientDistributor');

module.exports = 
class ApplicationServer extends WebSocketServer
{
  constructor(serverName)
  {
    var config = Config.get();
   
    super(config.servers[serverName]);

    this.config = config;
    this.config.currentServerName = serverName; //very important, we use this to identify the current server's name

    this.serverName = serverName;

    //the root directory
    this.rootDir = __dirname + '/..';

    this.distributor = new ClientDistributor();
    this.db = new DB(this.serverName);
  }

  getDBServerPath()
  {
    return this.dbServerPath;
  }

  start()
  {
    //map application routes
    var routes = this.config.routes;
    for (var path in this.config.routes) {
      this
        .addPath(path)
        .getDefaultChannel()
        .onMessage = (client) => {
          var context = {};
          context.config = this.config;
          context.rootDir = this.rootDir;
          context.distributor = this.distributor;
          context.serverName = this.serverName;
          context.db = this.db;
          var handler = require(context.rootDir + '/handlers/' + routes[client.path.path]);
          handler(context, client);
        }
    }

    super.start(); //start the web server
  }
}
