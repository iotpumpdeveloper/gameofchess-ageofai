const WebSocketServer = require('./WebSocketServer');
const WebSocketClient = require('./WebSocketClient');
const Path = require('./Path');
const Config = require('./Config');
const EncryptedPath = require('./EncryptedPath');
const DBFactory = require('./DBFactory');

module.exports = 
class ApplicationServer extends WebSocketServer
{
  constructor(serverName)
  {
    var config = Config.get();
   
    super(config.servers[serverName]);

    this.config = config;

    this.serverName = serverName;

    //the root directory
    this.rootDir = __dirname + '/..';

    this.dbFactory = DBFactory;

    this.dbServerPath = new EncryptedPath('db_server', this.serverName);
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
        .onMessage = (message, client) => {
          var context = {};
          context.message = message;
          context.client = client;
          context.config = this.config;
          context.rootDir = this.rootDir;
          context.dbFactory = this.dbFactory;
          var handler = require(context.rootDir + '/handlers/' + routes[client.path.path]);
          handler(context, client);
        }
    }

    //add db server path for this server
    var path = this.dbServerPath.getName();

    this
      .addPath(this.dbServerPath)
      .getDefaultChannel()
      .onMessage = (message, client) => { //now there is incoming message on database server path 
        var messageObj = JSON.parse(message);
        this.dbFactory.getInstanceByServerName(this.serverName).onMessage(message, client);
      }

    super.start(); //start the web server
  }
}
