<script setup>
import { ref,watch } from "vue";
import {UserStore} from "../stores/user.js"
import {router} from '../router/index.js'

UserStore().pageImIn = 'profile'
const email = ref();
const Fname = ref();
const username = ref();
const Lname = ref();
const infos = ref ('');
if(!UserStore().IsAGuest){
    email.value = UserStore().userDetails.email;
    Fname.value = UserStore().userDetails.Fname;
    username.value = UserStore().userDetails.username;
    Lname.value = UserStore().userDetails.Lname;
    UserStore().getNotificationList()
    infos.value = '';
    console.log(username.value);
}
console.log(UserStore().IsAGuest);

function DoneClickHandler(){
    if(UserStore().userDetails.email == email.value && UserStore().userDetails.Fname == Fname.value && UserStore().userDetails.Lname == Lname.value && UserStore().userDetails.username == username.value ){
        infos.value = "Updated nothing!"
    }
    let msg= {
        "email": email.value,
        "username":username.value.toLowerCase(),
        "Fname":Fname.value,
        "Lname":Lname.value,
        };
    const userS = UserStore();
    userS.EditProf(msg);
     watch(() => userS.ServerAns, (first, second) => {
      console.log(
        "Watch props.selected function called with args:",
        first,
        second
      );
    infos.value=first;
    });
    if (infos.value == 'Done!'){
        
    }
}
function login(){
    window.location.replace('http://localhost:5173/login')
}
function signup(){
    window.location.replace('http://localhost:5173/signup')
}

</script>

<template >
    <div  class="h-full flex flex-col">
        <p class="text-3xl font-light mt-10 ml-10 mb-5">Profile</p>
        <div v-if = "UserStore().IsAGuest" class="bg-base-200 h-full">
            <p class="font-light text-2xl p-5 text-center mt-10">You gotta have an account to change open your profile details!</p>
            <div class="w-fit m-auto mb-4">
                <button class="btn btn-accent m-5 my-2" :class="{'btn-active':UserStore().pageImIn == 'Meeting'}" @click="login() ">
                    <span class="">
                    Login
                    </span>
                </button>
                <button class="btn btn-primary m-5 my-2" :class="{'btn-active':UserStore().pageImIn == 'Meeting'}" @click ="signup()">
                    <span class="">
                    Signup
                    </span>
                </button>
            </div>
            <img src ="../assets/svgs/ill3.svg" class="m-auto w-4/12 mb-0"/>
        </div>
        <div v-else class="flex z-0 bg-base-200 h-full">
            <div class="avatar placeholder block mx-10 my-10">
                <div class="bg-gradient-to-tr from-[#4158D0] via-[#C850C0] to-[#FFCC70] text-neutral-content rounded-full w-60">
                    <span class="text-5xl">{{username.slice(0,2).toUpperCase()}}</span>
                </div>
            </div> 
            <div class="grow">
                <h2 class="text-3xl font-light self-start mt-10">Edit your profile:</h2>
                <p class="justify-self-start self-start mb-10 text-lg font-light">Your Account Details:</p>
                <p v-if="infos!=''" class="text-red-500 absolute top-[13.5%] text-base font-light">{{infos}}</p>
                <div class="form-control mb-3">
                    <p class="justify-self-start self-start text-lg font-light">Your Username:</p>
                    <input type="text" placeholder="Username" class="input input-bordered disabled:text-slate-500 w-1/3" v-model="username"/>
                </div>
                <div class="form-control mb-3">
                    <p class="justify-self-start self-start text-lg font-light">Your Email:</p>
                    <input type="text" placeholder="Email" class="input input-bordered disabled:text-slate-500 w-1/3" v-model="email"/>
                </div>
                <div class="form-control mb-10">
                    <p class="justify-self-start self-start text-lg font-light">Your Name:</p>
                    <div class="flex w-full justify-start">
                        <input type="text" placeholder="First name" class="input input-bordered disabled:text-slate-500 w-1/3 mr-5" v-model="Fname"/>
                        <input type="text" placeholder="Last name" class="input input-bordered disabled:text-slate-500 w-1/3" v-model="Lname" />
                    </div>
                </div>
                <div class="w-full mt-2 flex">
                    <button class="btn mr-5 w-1/3 font-light text-base" @click="router.push('/prifleEdit/ChangePassword')">Change your password</button>
                    <button class="btn hover:bg-[hsl(151,58%,50%)] hover:border-[hsl(151,58%,50%)] btn-success w-1/3 font-light text-base" @click="DoneClickHandler">Done!</button>
                </div>
            </div>
        </div>
    </div>

</template>