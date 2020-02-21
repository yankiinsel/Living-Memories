import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import ImageUploader from 'vue-image-upload-resize';
import Notifications from 'vue-notification';
import App from './App.vue';
import router from './router/index';
import store from './store/index';

Vue.use(BootstrapVue);
Vue.use(ImageUploader);
Vue.use(Notifications);


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
