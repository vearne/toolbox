// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios';
import uweb from 'vue-uweb'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$http = axios;
axios.defaults.baseURL = 'api'
// axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.use(ElementUI);
// 加入友盟统计代码
Vue.use(uweb,'1271851294')
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
