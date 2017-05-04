/**
 * a wrapper around the config file
 */
module.exports = 
class Config 
{
  static init(configFilePath)
  {
    var fs = require('fs');
    var configJSON = fs.readFileSync(configFilePath).toString();
    this.config = JSON.parse(configJSON);
  }

  static get()
  {
    return this.config;
  }
}
