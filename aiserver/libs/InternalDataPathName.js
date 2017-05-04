/**
 * An Internal Data Channel is a unique channel for an internal server to send and receive data from another internal server
 */
const EncryptionUtil = require('./EncryptionUtil');
const Config = require('./Config');

module.exports = 
class InternalDataPathName
{
  static onServer(serverName)
  {
    var config = Config.get();
    var serverInfo = config.servers[serverName];
    serverInfo.name = serverName;
    serverInfo.secretKey = config.servers[serverName].secretKey;

    var pathName = '/' + EncryptionUtil.get_sha512(
      JSON.stringify(serverInfo)
    );

    return pathName;
  }
}
