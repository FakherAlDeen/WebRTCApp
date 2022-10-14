<script setup>
import { ref,watch,toRef } from "vue";  
import { UserStore } from "../stores/user.js";
import {router} from '../router/index.js'


const username = ref('');
const props = defineProps({
  Header: {
    type: String,
  },
  txt:{
    type: String,
  },
  btn:{
    type: String,
  },
  btn2:{
    type: String
  },
  open:{
    type: Boolean
  },
  withBtn1:{
    type: Boolean
  },
  withBtn2:{
    type: Boolean
  },
  FuncBtn1:{
    type: String
  },
  FuncBtn2:{
    type: String
  },
  room:{
    type: String
  },
  usernameInvite :{
    type: String
  },
  RoomName:{
    type:String
  }
})

console.log('bz',props.Header);
const emit = defineEmits(['onClose'])
const closeOpen= ref(props.open)
watch(() => props.open, (first, second) => {
      console.log(
        "Watch props.selected function called with args:",
        first,
        second
      );
    closeOpen.value=first;
    });
function CloseHandler(){
  closeOpen.value=false
}

function signup(){
  window.location.replace('https://fakhermeets.13.development.maqsam.com/signup')

}


function login(){
  UserStore().SignOut()
}

function FirstFunctionHandler(){
  if(props.FuncBtn1 == 'SignUp'){
    signup()
  }else if (props.FuncBtn1 == 'justClose'){
    closeOpen.value = false;
    emit('onClose')
  }
}
function SecondFunctionHandler(){
  if(props.FuncBtn2 == 'LogIn'){
    login()
  }else if (props.FuncBtn2 == 'AcceptInivte'){
    let msg={
        'type':'ReplyInvite',
        'from':UserStore().userDetails.username,
        'name': UserStore().userDetails.Fname + ' ' + UserStore().userDetails.Lname,
        'to': props.usernameInvite,
        'roomName':props.RoomName,
        'room': props.room,
        flag:true
      }
    UserStore().EmmitMsg('OutOfMeeting',msg)
    router.push({
      name: 'meeting',
      params: {
            RoomName: props.RoomName,
            RoomID: props.room
        }
    })
  }else if (props.FuncBtn2 == 'ReplyInivte'){
    router.push({
      name: 'meeting',
      params: {
            RoomName: props.RoomName,
            RoomID: props.room
        }
    })
  }
}

</script>

<template>
  <div class="modal" :class="{'modal-open': closeOpen}" id="my-modal-2">
  <div class="modal-box">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2" @click="CloseHandler; emit('onClose')" >✕</label>
    <h3 class="font-bold text-lg" v-html="Header"></h3>
    <p class="py-4" v-html="txt"></p>
    <div class="modal-action">
     <a v-if="props.withBtn1" class="btn btn-error" @click="FirstFunctionHandler">{{btn}}</a>
     <a v-if="props.withBtn2" class="btn btn-success" @click="SecondFunctionHandler">{{btn2}}</a>
    </div>
  </div>
</div>
</template>

<style scoped>
</style>
