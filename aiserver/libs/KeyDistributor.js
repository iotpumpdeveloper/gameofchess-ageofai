const Config = require('./Config');
const CRC32 = require('CRC-32');
const md5 = require('md5');

module.exports = 
  class KeyDistributor
{
  constructor()
  {
    var config = Config.get();
    this.virtualServerNames = [];
    for (var serverName in config.servers) {
      if (config.servers[serverName].weight == undefined) { //if weight is not defined, default to 1
        config.servers[serverName].weight = 1;
      }
      for (var i = 1; i <= config.servers[serverName].weight; i++) {
        this.virtualServerNames.push(serverName);
      }
    }
  }

  getServerNameForKey(key)
  {
    var numOfVirtualServerNames = this.virtualServerNames.length;
    var index = Math.abs(CRC32.str(md5(key))) % numOfVirtualServerNames;
    return this.virtualServerNames[index];
  }
}
