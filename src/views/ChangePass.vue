<script setup>
import { ref,watch } from "vue";
import {UserStore} from "../stores/user.js"
import {router} from '../router/index.js'
UserStore().pageImIn = 'password'

const oldPass = ref('');
const newPass = ref('');
const newPass2 = ref('')
const infos = ref('')
if(UserStore().google){
    infos.value = 'Is this your first time?Changing password? use \'uudsx\' as the old one'
}
function ChangeClickHandler(){
    if(oldPass.value == '' || newPass.value == '' ){
        infos.value = "Fields are empty!";
        return;
    }
    if(newPass.value != newPass2.value){
        infos.value = "passwords don't match!";
        return;
    }
    UserStore().changePass(oldPass.value,newPass.value)
    watch(() => UserStore().ServerAns, (first, second) => {
      console.log(
        "Watch props.selected function called with args:",
        first,
        second
      );
    infos.value=first;
    });
}
</script>

<template>
    <div  class="h-full flex flex-col">
        <p class="text-3xl font-light mt-10 ml-10 mb-5">Password</p>
        <div class="flex z-0 bg-base-200 h-full">
            <div class="avatar placeholder block mx-10 my-10">
                <div class="bg-gradient-to-tr from-[#4158D0] via-[#C850C0] to-[#FFCC70] text-neutral-content rounded-full w-60">
                    <span class="text-5xl">{{UserStore().userDetails.username.slice(0,2).toUpperCase()}}</span>
                </div>
            </div> 
            <div @click="router.replace('/profileEdit')" class="absolute top-1 left-3 btn btn-circle btn-ghost">
                <img class="w-6 mr-1" src='../assets/svgs/left-arrow-svgrepo-com.svg'/> 
            </div>
            <div class="grow">
                <h2 class="text-3xl font-light self-start mt-10">Change your password:</h2>
                <p class="justify-self-start self-start mb-10 text-lg font-light">Your Account Details:</p>
                <p v-if="infos!=''" class="text-red-500 absolute top-[13.5%] text-base font-light">{{infos}}</p>
                <div class="form-control mb-3">
                    <p class="justify-self-start self-start text-lg font-light">Your old Password:</p>
                    <input type="password" placeholder="Old Password" class="input input-bordered disabled:text-slate-500 w-1/3" v-model="oldPass"/>
                </div>
                <div class="form-control mb-3">
                    <p class="justify-self-start self-start text-lg font-light">Your new password:</p>
                    <input type="password" placeholder="New Password" class="input input-bordered disabled:text-slate-500 w-1/3" v-model="newPass"/>
                </div>
                <div class="form-control mb-10">
                    <p class="justify-self-start self-start text-lg font-light">Just to check once again please:</p>
                    <div class="flex w-full justify-start">
                        <input type="password" placeholder="New Password" class="input input-bordered disabled:text-slate-500 w-1/3 mr-5" v-model="newPass2"/>
                    </div>
                </div>
                <div class="w-full mt-2 flex">
                    <button class="btn hover:bg-[hsl(151,58%,50%)] hover:border-[hsl(151,58%,50%)] btn-success w-1/3 font-light text-base" @click="ChangeClickHandler">Done!</button>
                </div>
            </div>
        </div>
    </div>
</template>