const Config = require('./Config');
const KeyDistributor = require('./KeyDistributor');

module.exports =
class DBFactory
{
  static getInstanceByServerName(serverName)
  {
    var config = Config.get();

    if (this.db == undefined) {
      this.db = {};
      this.keyDistributor = new KeyDistributor();
    }

    if (this.db[serverName] == undefined) {
      var host = config[serverName].host;
      var port = config[serverName].port;
      var dbDir = __dirname + '/../../db/' + serverName;
      this.db[serverName] = new DB(host, port, dbDir);
    }

    return this.db[serverName];
  }

  static getInstanceForKey(keyName)
  {
    var serverName = KeyDistributor.getServerNameForKey(keyName);       
    return this.getInstanceByServerName(serverName);
  }
}
