const fs = require('./FileSystem');

module.exports = 
  class DB
{
  constructor(host, port, dbDir)
  {
    this.host = host;
    this.port = port;
    this.dbDir = dbDir;
    this.storage = {}; //the in-memory storage
  }

  getHost()
  {
    return this.host;
  }

  getPort()
  {
    return this.port;
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
    if (await fs.exists(entryPath) ) {
      await fs.writeFile(entryPath, entryValue); //save entry to disk 
      this.storage[setName][entryName] = entryValue;  //save entry to in-memory stroage
    }
  }

  getEntry(setName, entryName)
  {
    return this.storage[setName][entryName];
  }
}
