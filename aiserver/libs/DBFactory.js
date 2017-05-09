const Config = require('./Config');
const KeyDistributor = require('./KeyDistributor');
const DB = require('./DB');

module.exports =
class DBFactory
{
  static getInstanceByServerName(serverName)
  {
    var config = Config.get();

    if (this.db == undefined) {
      this.db = {};
    }

    if (this.db[serverName] == undefined) {
      var host = config.servers[serverName].host;
      var port = config.servers[serverName].port;
      var dbDir = __dirname + '/../../db/' + serverName;
      this.db[serverName] = new DB(host, port, dbDir);
    }

    return this.db[serverName];
  }

  static getInstanceForKey(keyName)
  {
    var config = Config.get();
  
    var serverMap = {};
    for (serverName in config.servers) {
      if (serverName != 's0') {
        serverMap[serverName] = {weight : 1};
      } 
    }

    if (this.keyDistributor == undefined) {
      this.keyDistributor = new KeyDistributor(serverMap);
    }

    var serverName = this.keyDistributor.getServerNameForKey(keyName);       
    return this.getInstanceByServerName(serverName);
  }
}
