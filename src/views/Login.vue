<script setup>
import { ref,watch } from "vue";
import {UserStore} from "../stores/user.js"
import {router} from '../router/index'
import { decodeCredential,googleTokenLogin } from 'vue3-google-login'


UserStore().pageImIn = 'Login'
const username = ref("");
const password = ref("");
const infos = ref ('');
const userS = UserStore();

const callback = (response) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  const userData = decodeCredential(response.credential)
  console.log(response)
  console.log(userData)
  UserStore().Set_Credent_Google(userData);

}

async function getdata(){
    if (username.value=='' || password.value=='') {infos.value ='Complete the reqiured fields'; return;}
    let msg= {
        "username": username.value.toLowerCase(),
        "password": password.value
        };
        userS.Login(msg)
        console.log('MSG', msg)
    watch(() => userS.ServerAns, (first, second) => {
      console.log(
        "Watch props.selected function called with args:",
        first,
        second
      );
    infos.value=first;
    });
    infos.value = userS.ServerAns
}

async function guestHandler (){
    const userS = UserStore();
    userS.loginAsAguest();
}
</script>

<template >
        <div class="avatar placeholder">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-1/3 mx-auto mt-20">
                <span class="text-3xl" v-if="username!=''">{{username.slice(0,2).toUpperCase()}}</span>
            </div>
        </div>
        <p class="text-lg text-gray-500 font-light mt-4 text-center">Please Sign in</p>
        <p v-if="infos!=null || infos!=''" class="text-red-500 absolute text-center top-1/3 w-full">{{infos}}</p>
        <input type="text" placeholder="username" class="input input-bordered  m-5 my-2 mt-32 p-5" v-model="username"/>
        <input type="password" placeholder="Password" class="input input-bordered  m-5 my-2 p-5" v-model="password"/>
        <a @click="router.push('/signup')" class="text-sky-500 text-center">don't have an account wanna make one?</a>
        <button class="btn btn-ghost m-5 mt-24 " @click="getdata" :class="{}" >
            <span class="mr-2">
              <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"><path d="M17,2H7C5.3,2,4,3.3,4,5v6h8.6l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l4,4c0.4,0.4,0.4,1,0,1.4c0,0,0,0,0,0l-4,4c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l2.3-2.3H4v6c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3V5C20,3.3,18.7,2,17,2z"/></svg>
            </span>
            <span>
              Sign in
            </span>
        </button>
        <button class="btn btn-ghost m-5 mt-1  mb-1" @click="guestHandler" :class="{}" >
            <span>
                Log In as a guest
            </span>
        </button>
        <div class="card-actions self-center rounded-3xl text-center">
            <GoogleLogin class="w-full rounded-3xl" :callback="callback"/>
        </div>
        
</template>