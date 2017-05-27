/**
 * Broadcast the ai experience to all servers
 */

var fs = require('fs');
var child_process = require('child_process');

var KeyDistributor = require(__dirname + '/../libs/KeyDistributor.js');
var Config = require(__dirname + '/../libs/Config.js');

Config.init('../../aiserver/config.json');

var experienceDBDir = __dirname + '/../../experience';

var kd = new KeyDistributor();

fs.readdir(experienceDBDir, function(err, files) {
  for (var i = 0; i < files.length; i++) {
    var sourceFile = experienceDBDir + '/' + files[i];
    var serverName = kd.getServerNameForKey(files[i]);
    var targetFile = __dirname + '/' + '../../db/' + serverName + '/experience/' + files[i];
    var cmd = "cp '" + sourceFile + "' '" + targetFile + "'";
    child_process.execSync(cmd);
  } 
});
