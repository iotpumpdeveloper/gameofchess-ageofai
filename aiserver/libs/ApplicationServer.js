const WebSocketServer = require('./WebSocketServer');
const Path = require('./Path');
const EncryptedPath = require('./EncryptedPath');
const Config = require('./Config');
const ClientDistributor = require('./ClientDistributor');
const KeyEncyptionAlgorithm = require('./KeyEncryptionAlgorithm');
const DB = require('./DB');

module.exports =
class ApplicationServer extends WebSocketServer
{
  constructor(serverName)
  {
    //things that do not need to hot reload goes here
    var config = Config.get();
    super(config.servers[serverName]);
    this.serverName = serverName;
    this.db = new DB(this.serverName);
    //the root directory
    this.rootDir = __dirname + '/..';
  }

  _sendResponseBackToClientOnRoute(route, client, response)
  {
    //if response is not an object, still default to success false
    if (typeof response !== 'object') {
      response = {
        success : false
      }
    }

    if (route.keep_open  === false) {
      client.endJSON(response);
    } else {
      client.sendJSON(response); //we just send the json response and do not close the websocket
    }
  }

  async _handleInternalPathContext(internal_paths, context) {
    var client = context.client;
    var handler = require(context.rootDir + '/internal_handlers/' + internal_paths[client.path.path].handler);
    try {
      context.response = await handler(context); //wait for the response
      //internal path is a special route
      this._sendResponseBackToClientOnRoute(internal_paths[client.path.path], client, context.response);
    } catch (err) {
      console.log(err);
      context.resonse = {
        success : false
      }
      this._sendResponseBackToClientOnRoute(internal_paths[client.path.path], client, context.response);
    }
  }

  /**
   * things that need to be hot reload goes here
   */
  hotReload()
  {
    this.config = Config.get();
    this.config.currentServerName = this.serverName; //very important, we use this to identify the current server's name
    this.distributor = new ClientDistributor(); //very important, we need to hot reload the client distributor

    //now we need to hot reload all the routes
    //map application routes

    //first of all, clear all the existing paths
    this.clearAllPaths();
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

          //now on the client's behavior on this route

          if ( routes[client.path.path].keep_open == undefined ) {
            routes[client.path.path].keep_open = false; //default behavior is websocket will be closed immediately
          }

          //we are going to do all the complex key distribution logic here, so let each handler function focus on a specific server
          try {

            if (typeof client.message !== 'string') {
              throw new Error('Invalid incoming message, expect to be a string');
            }

            if (client.message.trim().length === 0) {
              throw new Error('Invalid incoming message, expect to be JSON');
            }

            client.data = JSON.parse(client.message); //we assume the client will always send a valid json

            if (typeof client.data !== 'object') {
              throw new Error('Invalid incoming data, expected to be JSON');
            }

            //make sure the client's distribution_key_data_field is valid
            var distribution_key_data_field = routes[client.path.path].distribution_key_data_field;
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

                //now bind the client to the context
                context.client = client;

                context.response = await handler(context); //wait for the response
                this._sendResponseBackToClientOnRoute(routes[client.path.path], client, context.response);
              })
              .distribute(client, distribution_key);
          } catch (err) {
            console.log(err);
            context.resonse = {
              success : false
            }
            this._sendResponseBackToClientOnRoute(routes[client.path.path], client, context.response);
          }
        }
    }

    //now handle the encypted internal paths
    var internal_paths = {};
    for (var path in this.config.internal_paths) {
      var encryptedPath = new EncryptedPath(path, this.serverName);
      internal_paths[encryptedPath.path] = this.config.internal_paths[path];
    }

    for (var encryptedPathName in internal_paths) {
      this
        .addPath(encryptedPathName)
        .getDefaultChannel()
        .onMessage = (client) => {
          var context = {};
          context.config = this.config;
          context.rootDir = this.rootDir;
          context.serverName = this.serverName;
          context.db = this.db;
          context.client = client;

          if ( internal_paths[client.path.path].keep_open == undefined ) {
            internal_paths[client.path.path].keep_open = false; //default behavior is websocket will be closed immediately
          }

          this._handleInternalPathContext(internal_paths, context);
        }
    }
  }

  start()
  {
    this.hotReload();

    super.start(); //start the web server
  }
}
