<script setup>
import {UserStore} from "../stores/user.js"
import {useRoute} from "vue-router";
import {router} from '../router/index'

UserStore().pageImIn = 'Document'
if(!UserStore().IsAGuest){
  UserStore().getDocumentList();
}
console.log(UserStore().DocumentHistoryList);
const route = useRoute();
function RejoinHandler(RoomID,RoomName){
    UserStore().CheckDocument(RoomID)
    router.push({
        name: 'docs',
        params: {
            RoomName: RoomName,
            RoomID: RoomID
        }
    })
}

function openLastDocument(){
    router.push({
      name: 'docs',
      params: {
          RoomName: UserStore().LastDocumentName,
          RoomID: UserStore().LastDocument
      }
    })
}
function login(){
    window.location.replace('https://fakhermeets.13.development.maqsam.com:5173/login')
}
function signup(){
    window.location.replace('https://fakhermeets.13.development.maqsam.com:5173/signup')
}
</script>

<template >
    <div class="h-full flex flex-col">
      <div class="flex items-end mb-5">
        <p class="text-3xl font-light mt-10 ml-10">Document History</p>
        <button v-if="UserStore().LastDocument" @click="openLastDocument" class="btn absolute right-[9rem] top-[46%]">Open Last Document</button>
      </div>
      <div class="h-full bg-base-200">
        <div v-if = "UserStore().IsAGuest" class="bg-base-200 h-full">
            <p class="font-light text-2xl p-5 text-center mt-10">You gotta have an account for us to keep track of your History!</p>
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
            <img src ="../assets/svgs/ill4.svg" class="m-auto w-6/12 mb-0"/>
        </div>
        <template v-else-if="UserStore().DocumentHistoryList.length>0">
          <div class="w-full h-full max-h-[87%] overflow-y-auto">
            <div class="w-full">
              <template v-for="val in UserStore().DocumentHistoryList" :key="val">
                <div class="card w-fit h-fit max-w-[22%] max-h-[15rem] bg-base-100 drop-shadow-xl mx-5 h-full z-0 bg-[#f14e6d] mt-5 inline-block">
                      <div class="card-body items-center text-center m-auto p-5">
                          <h2 class="text-white text-lg font-bold text-2xl">Document name</h2>
                          <h2 class="text-white text-lg font-light text-2xl">{{val.Name}}</h2>

                          <div class="border-b-2 border-white w-full"></div>
                          <div class="overflow-y-auto max-h-[4rem]">
                            <h2 class="card-title text-white text-sm font-light"><span class="text-white">Sharing ID:</span>{{val.RoomID}}</h2>
                            <h2 class="card-title text-white text-sm font-light"><span class="text-white">Created by:</span>{{val.Owner}}</h2>
                            <h2 class="card-title text-white text-sm font-light"><span class="text-white">Last joined:</span>{{val.LastTime.split('T')[0]}}</h2>
                          </div>
                          <div class="card-actions">
                              <button class="btn btn-ghost text-white border-b-4 border-white" @click="RejoinHandler(val.RoomID,val.Name)">Open!</button>
                          </div>
                      </div>
                  </div>
              </template>
            </div>
          </div>

        </template>
        <div class="mt-[17%]" v-else>
          <p class="text-center text-3xl font-light mb-10">You Have no Decuments! Please Start one in the List page!</p>
          <img src ="../assets/svgs/ill5.svg" class="m-auto w-2/12 mb-0"/>

        </div>
      </div>
    </div>
</template>

<style scoped>

</style>