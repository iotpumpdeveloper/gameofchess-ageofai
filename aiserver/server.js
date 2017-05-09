var args = process.argv;

if (args.length < 3) {
  console.log("Missing server type");
  console.log("example: node server.js s0");
  console.log("example: node server.js s1");
  process.exit();
}

try {
  process.chdir(__dirname);
} catch(error){
  console.log(error);
  process.exit();
}

var Config = require('./libs/Config');
Config.init('./config.json');

var serverName = args[2].trim();

var config = Config.get();

if (serverName in config.servers) {
  if (serverName == 's0') {
    var PublishingServer = require('./libs/PublishingServer');
    new PublishingServer(serverName).start();
  } else{
    var ApplicationServer = require('./libs/ApplicationServer');
    new ApplicationServer(serverName).start();
  }
}
