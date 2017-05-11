const WebSocketServer = require('./WebSocketServer');
const WebSocketClient = require('./WebSocketClient');
const Path = require('./Path');
const Config = require('./Config');
const ClientDistributor = require('./ClientDistributor');
const KeyEncyptionAlgorithm = require('./KeyEncryptionAlgorithm');
const DB = require('./DB');

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
          client.data = JSON.parse(client.message); //we assume the client will always send a valid json
         
          //we are going to do all the complex key distribution logic here, so let each handler function focus on a specific server
          try {
            var distribution_key_data_field = routes[client.path.path].distribution_key_data_field;

            //make sure the client's distribution_key_data_field is valid
            if ( client.data[distribution_key_data_field] == undefined ) {
              throw new Error('Expecting key ' + distribution_key_data_field + ' in incoming message data');
            }

            if ( typeof client.data[distribution_key_data_field] != 'string' ) {
              throw new Error('Expecting key ' + distribution_key_data_field + ' to be a string!');
            }

            if ( client.data[distribution_key_data_field].trim().length == 0 ) {
              throw new Error('Expecting key ' + distribution_key_data_field + ' not be empty!');
            }

            var distribution_key_algorithm = routes[client.path.path].distribution_key_algorithm;
            var distribution_key = KeyEncyptionAlgorithm[distribution_key_algorithm](client.data[distribution_key_data_field]);


            context
              .distributor
              .onSettle( async () => {
                var handler = require(context.rootDir + '/handlers/' + routes[client.path.path].handler);
                client.dk = distribution_key;
                handler(context, client);
              })
              .distribute(client, distribution_key);
          } catch (err) {
            console.log(err);
            client.endJSON({
              success : false
            }); 
          }

        }
    }

    super.start(); //start the web server
  }
}
