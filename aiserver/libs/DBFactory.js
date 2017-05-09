const Config = require('./Config');

module.exports =
class DBFactory
{
  static getInstance(serverName)
  {
    var config = Config.get();

    if (this.db == undefined) {
      this.db = {};
    }

    if (this.db[serverName] == undefined) {
      var host = config[serverName].host;
      var port = config[serverName].port;
      var dbDir = __dirname + '/../../db/' + serverName;
      this.db[serverName] = new DB(host, port, dbDir);
    }

    return this.db[serverName];
  }
}
