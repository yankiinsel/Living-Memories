import Vue from 'vue';
import Router from 'vue-router';
import HomePage from './components/HomePage.vue';
import ProfilePage from './components/ProfilePage.vue';
import LoginPage from './components/LoginPage.vue';
import MemoryDetail from './components/MemoryDetail.vue';


Vue.use(Router);

const routes = [{
  path: '/',
  name: 'HomePage',
  component: HomePage,
},
{
  path: '/profile',
  name: 'ProfilePage',
  component: ProfilePage,

},
{
  path: '/memory/:id',
  name: 'MemoryDetail',
  component: MemoryDetail,
  props: true,
},
{
  path: '/login',
  name: 'LoginPage',
  component: LoginPage,

}];

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes,
});

export default router;
