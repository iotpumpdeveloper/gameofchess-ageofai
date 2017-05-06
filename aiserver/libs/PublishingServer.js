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

    this.game = new Chess();
  }

  startPublishMove()
  {
    // we must write it in a non-blocking fashion
    var i;
    setInterval( () => {
      if (this.game.moves().length == 0) {
        console.log('Game over');
        console.log(game.turn());
      } else if (this.game.in_stalemate() ) {
        console.log('Stale Mate');
      } else {
        if (i % 2 == 0) {
          SimpleAI.setAIColor('white');
        } else {
          SimpleAI.setAIColor('black');
        }
        var move = SimpleAI.getNextBestMove(this.game);
        this.game.ugly_move(move);
        this.broadcastMoveForFen({
          move : move,
          fen : this.game.fen()
        }); 

        i++;
      }
    }, 50);
  }

  broadcastMoveForFen(info) 
  {
    var broadcastors = this.broadcastors;

    //start publish the move to the broadcasting servers
    for (var name in broadcastors) {
      if (broadcastors[name].readyState == 1) {
        broadcastors[name].send(JSON.stringify(info));
      } 
    }
  }

  start() 
  {
    var config = this.config;
    //maintain a list of web sockets connecting to each broadcasting server's idp
    //and keep them alived
    var broadcastors = [];
    var noop = () => {};

    var initBroadcastors = ()=> {
      for (var serverName in config.servers) {
        if (serverName != this.serverName) { //broadcasting servers 
          if (broadcastors[serverName] == undefined 
            || broadcastors[serverName].readyState == 3) {
            broadcastors[serverName] = new WebSocketClient(
              config.servers[serverName], 
              InternalDataPathName.onServer(serverName)
            ).connect();
            broadcastors[serverName].on('error', noop);
          }
        }
      }
      this.broadcastors = broadcastors;
      setTimeout(initBroadcastors, 3000);
    };

    initBroadcastors();

    this.startPublishMove();

    //start the server
    super.start();

  }
}
