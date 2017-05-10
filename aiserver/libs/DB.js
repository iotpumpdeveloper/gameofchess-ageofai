const fs = require('./FileSystem');
const Config = require('./Config');

module.exports = 
  class DB
{
  constructor(serverName)
  {
    var config = Config.get();
    this.serverInfo = config.servers[serverName];
    this.dbDir = __dirname + '/../../db/' + serverName;
    this.storage = {}; //the in-memory storage
  }

  getHost()
  {
    return this.serverInfo.host;
  }

  getPort()
  {
    return this.serverInfo.port;
  }

  getDBDir()
  {
    return this.dbDir;
  }
  
  async saveEntry(setName, entryName, entryValue)
  {
    if (this.storage[setName] == undefined) {
      this.storage[setName] = {};
    }

    var entryPath = this.dbDir + '/' + setName + '/' + entryName;
    await fs.writeFile(entryPath, entryValue); //save entry to disk 
    this.storage[setName][entryName] = entryValue;  //save entry to in-memory stroage
  }

  getEntry(setName, entryName)
  {
    var result;
    if (this.storage[setName] != undefined && this.storage[setName][entryName] != undefined ) {
      result = this.storage[setName][entryName];
    }
    return result;
  }
}
