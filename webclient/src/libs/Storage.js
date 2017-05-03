const _storage = {};

export default class {
  static setItem (name, value) {
    _storage[name] = value;
  }

  static getItem (name) {
    return _storage[name];
  }
}
