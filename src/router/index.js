import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '@/components/HelloWorld';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/pages/Login';
import Products from '@/components/pages/Products';
import Coupon from '@/components/pages/Coupon';
import CustomerOrder from '@/components/pages/CustomerOrders';
import CustomerCheckout from '@/components/pages/CustomerCheckout';

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
        {
          name: 'Coupon',
          path: 'coupon',
          component: Coupon,
          meta: { requiresAuth: true },
        },
      ]
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customer_order',
          name: 'CustomerOrder',
          component: CustomerOrder,
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout,
        },
      ]
    },
  ]
})