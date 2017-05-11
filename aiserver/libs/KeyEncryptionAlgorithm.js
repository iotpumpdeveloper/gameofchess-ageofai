/**
 * Utility functions to encrypt a specific key
 */
module.exports=
  class KeyEncyptionAlgorithm
{
  static sha512(key) {
    var crypto = require('crypto');
    var hash = crypto.createHash("sha512");
    hash.update(key)
    var value = hash.digest("hex");
    return value;
  }

  static sha1(key) {
    var crypto = require('crypto');
    var hash = crypto.createHash("sha1");
    hash.update(key)
    var value = hash.digest("hex");
    return value;
  }

  static querystring_escape(key) {
    var querystring = require('querystring');
    var value = querystring.escape(key);
    return value;
  }

  static trim(key) {
    var value = key.trim();
    return value;
  }
}
