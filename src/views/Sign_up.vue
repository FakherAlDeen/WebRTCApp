<script setup>
import { ref,watch } from "vue";
import {UserStore} from "../stores/user.js"
import { v4 as uuidv4 } from "uuid";
import route from "color-convert/route";
import {router} from '../router/index.js'

UserStore().pageImIn = 'Signup'

const email = ref("");
const password = ref("");
const Fname = ref("");
const username = ref("");
const Lname = ref("");
const check = ref (false)
const infos = ref ('');

function checktgl (){
    check.value = !check.value
}
function getdata(){
    let res = null
    if (email.value=='' || password.value=='' || username.value=='' || Fname.value=='' || Lname.value =='' || !check) {infos.value ='Complete the reqiured fields'; console.log ("kys"); return;}
    let msg= {
        'id':uuidv4(),
        "email": email.value,
        "username":username.value.toLowerCase(),
        "Fname":Fname.value,
        "Lname":Lname.value,
        "password": password.value
        };
    const userS = UserStore();
    userS.Signup_auth(msg,false)
     watch(() => userS.ServerAns, (first, second) => {
      console.log(
        "Watch props.selected function called with args:",
        first,
        second
      );
    infos.value=first;
    });
    // infos.value = userS.userDetails
}
    function clickBack(){
        router.push('/login')
        // window.location.replace('http://localhost:5173/login')
    }
</script>

<template >
        <button class="btn btn-circle btn-ghost absolute z-40 top-5 left-5" @click="clickBack"><img class="w-6 mr-1" src="../assets/svgs/left-arrow-svgrepo-com.svg"/> </button>
        <div class="avatar placeholder">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-1/3 mx-auto mt-20">
                <span class="text-3xl" v-if="username!=''">{{username.slice(0,2).toUpperCase()}}</span>
            </div>
        </div>
        <p class="text-lg text-gray-500 font-light mt-4 text-center">Fill the field to sign up</p>
        <p v-if="infos!=null || infos!=''" class="text-red-500 absolute text-center top-64 w-full">{{infos}}</p>
        <input type="text" placeholder="username" class="input input-bordered  m-5 my-2 mt-16 p-5" v-model="username"/>
        <input type="text" placeholder="Email" class="input input-bordered  m-5 my-2  p-5" v-model="email"/>
        <input type="text" placeholder="First name" class="input input-bordered  m-5 my-2  p-5" v-model="Fname"/>
        <input type="text" placeholder="Last name" class="input input-bordered  m-5 my-2  p-5" v-model="Lname"/>
        <input type="password" placeholder="Password" class="input input-bordered  m-5 my-2 p-5" v-model="password"/>
        <button class="btn btn-ghost m-5 mt-24 " @click="getdata" :class="{}" >
            <span class="mr-2">
              <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"><path d="M17,2H7C5.3,2,4,3.3,4,5v6h8.6l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l4,4c0.4,0.4,0.4,1,0,1.4c0,0,0,0,0,0l-4,4c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l2.3-2.3H4v6c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3V5C20,3.3,18.7,2,17,2z"/></svg>
            </span>
            <span>
              Sign Up
            </span>
        </button>
</template>