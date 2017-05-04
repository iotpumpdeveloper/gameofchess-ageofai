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

    /*//add livenews path*/
    /*this.addPath('/livenews');*/
    /*var liveNewsPath = this.getPath('/livenews');*/

    /*for (var i in this.config.newsSource.sources){*/
    /*liveNewsPath.addChannel(this.config.newsSource.sources[i]); */
    /*}*/

    /*liveNewsPath.getDefaultChannel().onMessage = (message, client) => {*/
    /*if (liveNewsPath.getChannel(message) != undefined) {*/
    /*client.switchToChannel(message);*/
    /*} else { */
    /*client.close();*/
    /*}*/
    /*}*/

    //add internal data path
    var idpName = InternalDataPathName.onServer(this.serverName); 
    console.log(idpName);
    this.addPath(idpName);

    var idp = this.getPath(idpName);

    idp.getDefaultChannel().onMessage = (message) => { //now there is incoming message on idp of this server
      var messageObj = JSON.parse(message);
      console.log(messageObj);
      //liveNewsPath.getChannel(messageObj.source).broadcast(JSON.stringify(messageObj.data));
    }

  }
}
