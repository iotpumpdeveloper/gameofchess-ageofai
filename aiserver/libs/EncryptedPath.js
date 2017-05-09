/**
 * an encrypted path on a specific server
 */
const Path = require('./Path');
const EncryptionUtil = require('./EncryptionUtil');
const Config = require('./Config');

module.exports=
class EncryptedPath extends Path 
{
  constructor(name, serverName) 
  {
    var config = Config.get();
    var serverInfo = config.servers[serverName];
    serverInfo.name = serverName;
    serverInfo.secretKey = config.servers[serverName].secretKey;
    
    var path = '/' + EncryptionUtil.get_sha512(
      JSON.stringify(serverInfo)
    );

    super(path);
  }
}
