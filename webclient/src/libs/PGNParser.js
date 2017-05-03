export default class {
  static parse(pgn) {
    return pgn
      .trim()
      .replace(new RegExp(/\s[0-9]+./g),'\n$&')
      .split('\n')
      .map(function(entry) {
        return entry.trim();
      });
  }
}
