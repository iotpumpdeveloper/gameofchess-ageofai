import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import WebSocketFactoryPlugin from './plugins/WebSocketFactoryPlugin.js';
import EventBusPlugin from './plugins/EventBusPlugin.js';
import GameServicePlugin from './plugins/GameServicePlugin.js';

import $ from 'jquery';

window.$ = $;

Vue.use(VueResource);
Vue.use(WebSocketFactoryPlugin);
Vue.use(EventBusPlugin); //this should load first
Vue.use(GameServicePlugin);

new Vue({
  el: '#app',
  render : h => {
    return h(App)
  }
})
