export default class WebSocketFactory
{
  /**
   * open a websocket connection to path, and try it keep it alive
   */
  static get(path, options) {
    if (this._wsMap == undefined) {
      this._wsMap = {};
    }

    if (this._wsMap[path] == undefined) {
      var wsUrl = "ws://" + location.host + path;
      if (location.protocol == "https:") {
        wsUrl = "wss://" + location.host + path;
      }

      this._wsMap[path] = {};
      this._wsMap[path].options = options; //set path specific websocket options
      this._wsMap[path]._interval = () => {
        if (this._wsMap[path]._ws == undefined || this._wsMap[path]._ws.readyState == 3) {
          this._wsMap[path]._ws = new WebSocket(wsUrl);
          this._wsMap[path]._ws.onopen = () => {
            //see if there is a pending message to send 
            if (this._wsMap[path]._message !== undefined) {
              console.log('about to send pending message');
              this._wsMap[path]._ws.send(this._wsMap[path]._message);
            }
          }

          this._wsMap[path].send = (obj, _messageHandler, _errorHandler) => {
            this._wsMap[path].sendMessage(JSON.stringify(obj), _messageHandler, _errorHandler); 
          }

          this._wsMap[path].sendMessage = (message, _messageHandler, _errorHandler) => {
            this._wsMap[path]._message = message;
            if (
              this._wsMap[path].options['immediate_reconnect_on_close'] 
              && this._wsMap[path]._ws.readyState == 3
            ) { //the connection is closed, 
              this._wsMap[path]._ws = new WebSocket(wsUrl);
              this._wsMap[path]._ws.onopen = () => {
                this._wsMap[path]._ws.send(this._wsMap[path]._message);
              }
            }
            this._wsMap[path]._ws.onmessage = (event) => {
              if (event.data !== undefined) {
                var response = {};
                response.data = JSON.parse(event.data);
                _messageHandler(response);
              }
            }
            this._wsMap[path]._ws.onerror = _errorHandler;
            if (this._wsMap[path]._ws.readyState == 1) {
              this._wsMap[path]._ws.send(this._wsMap[path]._message);
            }
          }

          this._wsMap[path].isClosed = () => {
            return (this._wsMap[path]._ws.readyState == 3);
          }
        }

        if (this._wsMap[path].options['keep_alive']) {
          setTimeout(this._wsMap[path]._interval, this._wsMap[path].options['keep_alive_retry_interval'] * 1000);
        }
      }

      this._wsMap[path]._interval();
    }
    return this._wsMap[path];
  }
}
