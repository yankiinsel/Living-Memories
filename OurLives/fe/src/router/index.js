import Vue from 'vue';
import Router from 'vue-router';
import Stories from './../views/Stories.vue';
import NewPost from './../views/NewPost.vue';
import Login from './../views/Login.vue';
import StoryDetail from './../views/StoryDetail.vue';

Vue.use(Router);

const routes = [{
  path: '/',
  name: 'Stories',
  component: Stories,
},
{
  path: '/post',
  name: 'NewPost',
  component: NewPost,

},
{
  path: '/memory/:id',
  name: 'StoryDetail',
  component: StoryDetail,
  props: true,
},
{
  path: '/login',
  name: 'Login',
  component: Login,

}];

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes,
});

export default router;
