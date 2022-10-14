import { redirect } from 'next/dist/server/api-utils/index.js';
import { createRouter, createWebHistory } from 'vue-router'
import {UserStore} from "../stores/user.js"


function guardMyroute(to, from, next)
{
 UserStore().checklogged();
 var isAuthenticated= false;
//this is just an example. You will have to find a better or 
// centralised way to handle you localstorage data handling 
if(!UserStore().isLoggedIN)
  isAuthenticated = false;
 else
  isAuthenticated= true;
 if(isAuthenticated) 
 {
  next(); // allow to enter route
 } 
 else
 {
  console.log('hi');
  console.log('guest',UserStore().isLoggedIN);
  next('/login'); // go to '/login';
 }
}


export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: {path:'/login'}
    },
    {
      path: '/docs',
      name: 'docs',
      beforeEnter: guardMyroute,
      component: () => import('../views/Document.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/meeting',
      name: 'meeting',
      beforeEnter: guardMyroute,
      component: () => import('../views/Meeting.vue'),
    }
    ,
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/Sign_up.vue')
    },
    {
      path: '/list',
      name: 'List',
      beforeEnter: guardMyroute,
      component: () => import('../views/List.vue')
    },
    {
      path: '/profileEdit',
      name: 'ProfileEdit',
      beforeEnter: guardMyroute,
      component: () => import('../views/EditProfile.vue')
    },
    {
      path: '/prifleEdit/ChangePassword',
      name: 'ChangePass',
      beforeEnter: guardMyroute,
      component: () => import('../views/ChangePass.vue')
    },
    {
      path: '/DocumentHistory',
      name: 'DocumentHistory',
      beforeEnter: guardMyroute,
      component: () => import('../views/DocuemntHistory.vue')
    },
    {
      path: '/MeetingHistory',
      name: 'MeetingHistory',
      beforeEnter: guardMyroute,
      component: () => import('../views/MeetingHistory.vue')
    },
  ]
})

export default router
