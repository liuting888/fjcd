// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'//
//
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/fe-animation.css';
import '@/styles/reset.css';
import '@/styles/fe-public.css';
import 'viewerjs/dist/viewer.css'
import ElementUI from 'element-ui';
import VueResource from "vue-resource"
//
import $ from 'jquery';
require('@/scripts/underscore-min'); //引入underscore
require('@/scripts/jquery.cookie'); //引入$.cookie
import Viewer from 'viewerjs';
import vueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//echarts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(vueQuillEditor);
Vue.config.productionTip = false
//
window.viewer = Viewer;
window.Vue = Vue;
window.init = function(){}; // ???
//fjPublic
window.fjPublic = require('@/scripts/fjPublic');
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
