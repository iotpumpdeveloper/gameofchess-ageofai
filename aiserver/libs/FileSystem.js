module.exports =
  class FileSystem 
{
  static access (fileName) {
    return new Promise ( (resolve, reject) => {
      require('fs').access(fileName, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  static exists (fileName) {
    return new Promise ( (resolve, reject) => {
      require('fs').access(fileName, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  static readFile (fileName) {
    return new Promise ( (resolve, reject) => {
      require('fs').readFile(fileName, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static writeFile (fileName, data) {
    console.log('writing file');
    return new Promise ( (resolve, reject) => {
      require('fs').writeFile(fileName, data, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}
