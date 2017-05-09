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

    this.storage = {}; //initiate an in-server storage
    this.storage.experience = {}; //storage the experience (fen => move pairs)

    //the root directory
    this.rootDir = __dirname + '/..';

    this.dbFactory = DBFactory;
  }

  //connect to the database on a specific server
  connectDBOnServer(serverName)
  {
    var dbMessagingPath = new EncryptedPath('db_messaging', serverName).getName();
    return new WebSocketClient(
      this.config.servers[serverName], 
      this.dbMessagingPath
    ).connect();
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
          context.db = this.db;
          var handler = require(context.rootDir + '/handlers/' + routes[client.path.path]);
          handler(context, client);
        }
    }

    //add db messaging path for this server
    var dbMessagingPath = new EncryptedPath('db_messaging', this.serverName).getName();

    this
      .addPath(dbMessagingPath)
      .getDefaultChannel()
      .onMessage = (message) => { //now there is incoming message on idp of this server
        var messageObj = JSON.parse(message);
        console.log(messageObj);
      }

    super.start(); //start the web server
  }
}
