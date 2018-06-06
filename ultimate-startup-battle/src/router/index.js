import Vue from 'vue';
import Router from 'vue-router';
import PrivateBattles from '@/components/privateBattles';
import PublicBattles from '@/components/publicBattles';
import Boats from '@/components/boats';
import Boat from '@/components/boat';
import Callback from '@/components/callback';
import { requireAuth } from '../utils/auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PublicBattles',
      component: PublicBattles,
    },
    {
      path: '/private-battles',
      name: 'PrivateBattles',
      beforeEnter: requireAuth,
      component: PrivateBattles,
    },
    {
      path: '/boats',
      name: 'Boats',
      // beforeEnter: requireAuth,
      component: Boats,
    },
    {
      path: '/boat/:id',
      name: 'Boat',
      // beforeEnter: requireAuth,
      component: Boat,
      props: true,
    },
    {
      path: '/callback',
      component: Callback,
    },
  ],
});