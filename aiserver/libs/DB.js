const fs = require('./FileSystem');
const Config = require('./Config');
const EncryptedPath = require('./EncryptedPath');

module.exports = 
  class DB
{
  constructor(serverName)
  {
    var config = Config.get();
    this.serverInfo = config.servers[serverName];
    this.storage = {}; //the in-memory storage
    this.dbServerPath = new EncryptedPath('db_server', serverName);
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
    return __dirname + '/../../db/' + this.serverName;
  }

  async getEntry(setName, entryName) 
  {
    var messageObj = { 
      serverName : this.serverName, //used to verifiy incoming messages
      action : 'get',
      setName : setName,
      entryName : entryName
    }
    var message = JSON.stringify(messageObj);
    var result = await sendMessage(message);
    return result; 
  }

  async saveEntry(setName, entryName, entryValue) 
  {
    var messageObj = { 
      serverName : this.serverName, //used to verifiy incoming messages
      action : 'set',
      setName : setName,
      entryName : entryName,
      entryValue : entryValue
    }
    var message = JSON.stringify(messageObj);
    var result = await sendMessage(message);
    return result.data;
  }

  sendMessage(message)
  {
    return new Promise(resolve, reject) => {
      var ws = new WebSocketClient(this.serverInfo, this.dbServerPath).connect();
      ws.on('open', () => {
        ws.send(message, (err) => {
          if (err) { //error sending message, reject
            reject(err);
          }
        });
        ws.on('message', (message) => {
          var messageObj = JSON.parse(message);
          if (messageObj.success) {
            resolve(messageObj.data); //successfully done with the db action
          } else {
            reject( new Error('invalid database server message!') );
          }
        });
      });
      ws.on('close', () => {
        reject( new Error('database web socket disconnected') );
      });
    });
  }

  /**
   * handle an incoming message to this database server
   */
  async onMessage(message, client)
  {
    var messageObj = JSON.parse(message);

    if (messageObj.serverName != this.serverName) {
      //a possible hacking attemp!
      client.endJSON({
        success : false
      });
    }

    if (messageObj.action == 'set') {
      var setName = messageObj.setName;
      var entryName = messageObj.entryName;
      var entryValue = messageObj.entryValue;
      await this._saveEntry(setName, entryName, entryValue);
      client.endJSON({
        success : true
      });
    } else if (messageObj.action == 'get') {
      var setName = messageObj.setName;
      var entryName = messageObj.entryName;
      var result = this._getEntry(setName, entryName);
      client.endJSON({
        success : true,
        data : result
      });
    }
  }

  async _saveEntry(setName, entryName, entryValue)
  {
    if (this.storage[setName] == undefined) {
      this.storage[setName] = {};
    }

    var entryPath = this.dbDir + '/' + setName + '/' + entryName;
    await fs.writeFile(entryPath, entryValue); //save entry to disk 
    this.storage[setName][entryName] = entryValue;  //save entry to in-memory stroage
  }

  _getEntry(setName, entryName)
  {
    var result;
    if (this.storage[setName] != undefined && this.storage[setName][entryName] != undefined ) {
      result = this.storage[setName][entryName];
    }
    return result;
  }
}
