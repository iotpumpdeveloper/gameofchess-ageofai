const fs = require('./FileSystem');
const Config = require('./Config');

module.exports = 
  class DB
{
  constructor(serverName)
  {
    var config = Config.get();
    this.serverName = serverName;
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
    console.log("successfully saved " + entryName + " on server " + this.serverName);
  }

  async getEntry(setName, entryName)
  {
    var result;
    if (this.storage[setName] != undefined && this.storage[setName][entryName] != undefined ) {
      console.log("reading entry " + entryName + " from memory");
      result = this.storage[setName][entryName];
    } else { //entry does not exist in memory, try reading it from disk
      var entryPath = this.dbDir + '/' + setName + '/' + entryName;
      if ( await fs.exists(entryPath) ) { //make sure the entry actually exists in disk
        var entryValue = await fs.readFile(entryPath);
        console.log("reading entry " + entryName + " from disk");
        if (this.storage[setName] == undefined) {
          this.storage[setName] = {};
        }
        this.storage[setName][entryName] = entryValue;
        result = entryValue;
      } 
    }
    return result;
  }
}
