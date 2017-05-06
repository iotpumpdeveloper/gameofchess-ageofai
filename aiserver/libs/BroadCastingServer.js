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
  }

  start()
  {
    super.start(); //start the web server

    // given a fen string, get the next best ai move
    this
      .addPath('/ws/ai/move/get')
      .getDefaultChannel()
      .onMessage = (message, client) => {
        var querystring = require('querystring');
        var fs = require('fs');
        var fen = message;
        var fenKey = querystring.escape(fen);
        var fenKeyEntry = __dirname + '/' + '../experience/' + fenKey;
        fs.access(fenKeyEntry, (err) => {
          if (!err) { //fen key entry exists
            var moveJSON = fs.readFileSync(fenKeyEntry);
            client.send(moveJSON);
          } else {
            client.send(''); //just send an empty string
          }
          client.close();
        });
      }

    // record the matching best move for a given fen string


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
