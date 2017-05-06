const WebSocketServer = require('./WebSocketServer');
const WebSocketClient = require('./WebSocketClient');
const Path = require('./Path');
const Config = require('./Config');
const InternalDataPathName = require('./InternalDataPathName');
const querystring = require('querystring');
const fs = require('fs');

module.exports = 
class BroadCastingServer extends WebSocketServer
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
    super.start(); //start the web server

    this
      .addPath('/ws/ai/move/get')
      .getDefaultChannel()
      .onMessage = (fen, client) => {
        var fenKey = querystring.escape(fen);
        var fenKeyEntry = __dirname + '/' + '../experience/' + fenKey;
        if (fs.existsSync(fenKeyEntry)) {
          var moveJSON = fs.readFileSync(fenKeyEntry);
          client.send(moveJSON);
        }
        client.close();
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

  }
}
