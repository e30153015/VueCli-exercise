import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '@/components/HelloWorld';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/pages/Login';
import Products from '@/components/pages/Products'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    // {
    //   name: '首頁',
    //   path: '/',
    //   component: Home,
    //   meta: { requiresAuth: true }
    // },
    {
      name: 'Login',
      path: '/login',
      component: Login,
    },
    {
      name: '首頁',
      path: '/admin',
      component: Dashboard,
      children: [
        {
          name: 'Products',
          path: 'products',
          component: Products,
          meta: { requiresAuth: true },
        },
      ]
    },
  ]
})