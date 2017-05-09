const Config = require('./Config');
const CRC32 = require('CRC-32');
const md5 = require('md5');

module.exports = 
  class KeyDistributor
{
  constructor(serverMap)
  {
    this.serverMap = serverMap;
    this.virtualServerNames = [];
    for (var serverName in this.serverMap) {
      for (var i = 1; i <= this.serverMap[serverName].weight; i++) {
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
