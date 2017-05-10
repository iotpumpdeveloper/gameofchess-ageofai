const Config = require('./Config');
const KeyDistributor = require('./KeyDistributor');
const DB = require('./DB');

module.exports =
class DBFactory
{
  static getInstanceByServerName(serverName)
  {
    if (this.db == undefined) {
      this.db = {};
    }

    if (this.db[serverName] == undefined) {
      this.db[serverName] = new DB(serverName);
    }

    return this.db[serverName];
  }

  static getInstanceForKey(keyName)
  {
    var config = Config.get();

    var serverMap = {};
    for (serverName in config.servers) {
      serverMap[serverName] = {weight : 1};
    }

    if (this.keyDistributor == undefined) {
      this.keyDistributor = new KeyDistributor(serverMap);
    }

    var serverName = this.keyDistributor.getServerNameForKey(keyName);       
    return this.getInstanceByServerName(serverName);
  }
}
