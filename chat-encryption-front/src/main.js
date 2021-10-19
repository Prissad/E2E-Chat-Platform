import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

require('@/assets/main.scss');
import * as setLocal from "@/core/local/setLocal";
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://192.168.57.4:3000',
}))

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.prototype.$joinChat = false

setLocal.createLocalStorageData(); // create temporary local storage data

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
