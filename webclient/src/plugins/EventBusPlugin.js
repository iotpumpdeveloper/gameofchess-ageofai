/**
 * This is the Event Bus Plugin 
 */
import Vue from 'vue';

export default class EventBusPlugin 
{
  static install(Vue) {
    Vue.prototype.$eventbus = new Vue();
  }
}
