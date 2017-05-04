module.exports = 
class EncryptionUtil
{
  static get_sha512(text) {
    var crypto = require('crypto');
    var hash = crypto.createHash("sha512");
    hash.update(text)
    var value = hash.digest("hex");
    return value;
  }

  static get_sha1(text) {
    var crypto = require('crypto');
    var hash = crypto.createHash("sha1");
    hash.update(text)
    var value = hash.digest("hex");
    return value;
  }

}
