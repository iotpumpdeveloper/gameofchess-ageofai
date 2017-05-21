var args = process.argv;

if (args.length < 4) {
  console.log("Missing server name and encrypted path name");
  console.log("example: node AppServerBridge.js s1 in_memory_storage");
  process.exit();
}

var Config = require('../aiserver/libs/Config');
Config.init('../aiserver/config.json');

var serverName = args[2].trim();
var path = args[3].trim();

const EncryptedPath = require('../aiserver/libs/EncryptedPath');
const WebSocketClient = require('../aiserver/libs/WebSocketClient');

path = new EncryptedPath(path, serverName).path;

(async () => {
  var wsPromise = new Promise( (resolve, reject) => {
    var _ws = new WebSocketClient(Config.get().servers[serverName], path).connect();
    _ws.on('open', () => {
      _ws.send('hello', (err) => {
        if (err) { //message is not sent
          console.log(err);
          reject(err); 
        }
      });
    });
    _ws.on('message', (msg) => {
      resolve(msg); 
      //now close the websocket 
      _ws.close();
    });
  });

  var msg = await wsPromise;
  console.log(JSON.parse(msg));
})();
