var args = process.argv;

if (args.length < 3) {
  console.log("Missing server name");
  console.log("example: node server.js s1");
  console.log("example: node server.js s2");
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
  var ApplicationServer = require('./libs/ApplicationServer');
  new ApplicationServer(serverName).start();
}
