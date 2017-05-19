/**
 * This is a centralize service component, depends on 
 * EventBusPlugin, WebSocketFactoryPlugin
 */
import WebSocketFactory from '../libs/WebSocketFactory.js';

export default class WebSocketFactoryPlugin
{
  static install(Vue) {
    Vue.prototype.$wsFactory = WebSocketFactory;
  }
}
