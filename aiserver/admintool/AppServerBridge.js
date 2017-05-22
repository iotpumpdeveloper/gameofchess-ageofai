var args = process.argv;

if (args.length < 5) {
  console.log("Missing server name and encrypted path name");
  console.log("example: node AppServerBridge.js s1 in_memory_storage set_name=experience");
  process.exit();
}

var Config = require('../libs/Config');
Config.init('../config.json');

var serverName = args[2].trim();
var path = args[3].trim();
var message = require('query-string').parse(args[4].trim());

const EncryptedPath = require('../libs/EncryptedPath');
const WebSocketRequest = require('../libs/WebSocketRequest');

path = new EncryptedPath(path, serverName).path;

(async () => {
  try {
    var request = new WebSocketRequest(serverName, path);
    var response = await request.send(message);
    console.log(response); 
  } catch(err) {
    console.log(err); 
  }
})();
