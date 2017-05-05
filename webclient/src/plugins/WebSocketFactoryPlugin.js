export default class WebSocketFactoryPlugin
{
  static install(Vue) {
    Vue.prototype.$wsFactory = WebSocketFactoryPlugin;
  }

  /**
   * open a websocket connection to path, and try it keep it alive
   */
  static get(path, options = {
    keep_alive : true,
    keep_alive_retry_interval : 5, //try to reconnect websocket every 5 seconds if it is closed
    immediate_reconnect_on_close : true // reconnect websocket immediately when it is closed
  }) {
    if (this._wsMap == undefined) {
      this._wsMap = {};
    }

    if (this._wsMap[path] == undefined) {
      var wsUrl = "ws://" + location.host + path;
      if (location.protocol == "https:") {
        wsUrl = "wss://" + location.host + path;
      }

      this._wsMap[path] = {};
      this._wsMap[path]._interval = () => {
        if (this._wsMap[path]._ws == undefined || this._wsMap[path]._ws.readyState == 3) {
          this._wsMap[path]._ws = new WebSocket(wsUrl);
          this._wsMap[path]._ws.onopen = () => {
            this._wsMap[path]._ws.send(this._wsMap[path]._message);
          }

          this._wsMap[path].sendMessage = (message, _messageHandler, _errorHandler) => {
            this._wsMap[path]._message = message;
            if (options['immediate_reconnect_on_close'] && this._wsMap[path]._ws.readyState == 3) { //the connection is closed, 
              this._wsMap[path]._ws = new WebSocket(wsUrl);
              this._wsMap[path]._ws.onopen = () => {
                this._wsMap[path]._ws.send(this._wsMap[path]._message);
              }
            }
            this._wsMap[path]._ws.onmessage = _messageHandler;
            this._wsMap[path]._ws.onerror = _errorHandler;
            if (this._wsMap[path]._ws.readyState == 1) {
              this._wsMap[path]._ws.send(this._wsMap[path]._message);
            }
          }

          this._wsMap[path].isClosed = () => {
            return (this._wsMap[path]._ws.readyState == 3);
          }
        }

        if (options['keep_alive']) {
          setTimeout(this._wsMap[path]._interval, options['keep_alive_retry_interval'] * 1000);
        }
      }

      this._wsMap[path]._interval();
    }
    return this._wsMap[path];
  }
}
