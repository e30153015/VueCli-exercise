import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import { ValidationProvider, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

// Add the required rule
extend('required', {
  validate: required.validate,
  computesRequired: true,
  message: "此欄位為必填欄位"
});
// Add the email rule
extend('email', {
  validate: email.validate,
  message: "電子郵件格式有誤！"
});
// Add a rule.
extend('phone', {
  validate: value => !isNaN(Number(value)),
  message: '電話格式有誤！'
});
extend('phoneLength', {
  validate: value => value.length === 10,
  message: '電話長度需為10碼'
});
// Register it globally
Vue.component('ValidationProvider', ValidationProvider);
import App from './App.vue';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';
import { nextTick } from 'q';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

Vue.component('loading', Loading)
Vue.filter('currency', currencyFilter);
axios.defaults.withCredentials = true;

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')

router.beforeEach((to, from, next) => {
  console.log('to', to, 'from', from, 'next', next)
  if (to.meta.requiresAuth) {
    console.log('這裡需要驗證');
    const api = `${process.env.VUE_APP_APIPATH}/api/user/check`
    axios.post(api).then((response) => {
      console.log(response.data)
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        })
      }
    })

  } else {
    next();
  }
})