import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import WebSocketFactoryPlugin from './plugins/WebSocketFactoryPlugin.js';
import EventBusPlugin from './plugins/EventBusPlugin.js';
import GameServicePlugin from './plugins/GameServicePlugin.js';

import $ from 'jquery';

window.$ = $;

[
  VueResource,
  WebSocketFactoryPlugin,
  EventBusPlugin, //this should load first
  GameServicePlugin
].forEach(plugin => {
  Vue.use(plugin);
});

new Vue({
  el: '#app',
  render : h => {
    return h(App)
  }
});
