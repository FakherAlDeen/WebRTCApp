<script setup>
import { ref,watch,onMounted } from "vue";
import {UserStore} from "../stores/user.js"
import {useRoute} from "vue-router";
import Doc from "../components/SharedDocYjs.vue";
import {router} from '../router/index'


UserStore().pageImIn = 'Document'
const usernameInvite = ref();
const Gotinvitedtxt = ref();
const openInviteModal = ref(false)
const ReplyInviteHeader = ref ();
const ReplyInviteTxt = ref();
const openReplyInviteModal = ref(false);
const route = useRoute();
const alert = ref(false);
const alertText = ref('');
let room = route.params.RoomID;
let roomName = route.params.RoomName;
if(!UserStore().IsAGuest)
UserStore().getNotificationList()
UserStore().LastDocument = room;
UserStore().LastDocumentName = roomName;
const openHistoryHandler = () => {
  router.push('/DocumentHistory')
}
console.log(room)
function invitModalTrigger(msg){
    usernameInvite.value = msg.from
    Gotinvitedtxt.value = "You got invited to a meeting by " + msg.name;
    openInviteModal.value = true;
    UserStore().getNotificationList();
}
function ReplyinviteModalTrigger(msg){
    ReplyInviteHeader.value ='<span class= "text-blue-600 font-bold text-lg">' + msg.name +'</span> Accepted you invitation';
    ReplyInviteTxt.value = 'you can Go to the meeting now or use this Room ID: <span class= "text-red-600"> <br>' +msg.room +'</span> to enter Later';
    openReplyInviteModal.value = true;
    UserStore().getNotificationList();
}
watch(()=>UserStore().Notify.length, (first,second)=>{
  console.log(first);
  console.log(second);
  invitModalTrigger(UserStore().Notify[second]);
})
</script>

<template >
    <div class="h-full flex flex-col">
      <div class="flex items-end mb-5">
        <p class="text-3xl font-light mt-10 ml-10">Document <span class="font-light text-base text-gray-500">Document sharing room name:'{{roomName}}'</span></p>
        <p class="font-light text-base text-gray-500 ml-4 mb-[1px]">Sharing ID: {{room}}</p>
        <button v-if="!UserStore().IsAGuest" @click="openHistoryHandler" class="btn absolute right-[9rem] top-[46%]">Document History</button>
      </div>
      <!-- <p class="text-3xl font-light mt-10 ml-10 mb-5">Document <span class="font-light text-base text-gray-500">Document sharing room name:'{{roomName}}'</span></p> -->
      <div class="h-full bg-base-200">
        <Doc :RoomName="roomName" :takemewithyou="true" Style="bg-base-200" :room="room" :with-close="false"/>
      </div>
    </div>
    
</template>

<style scoped>
.slide-enter-from ,
  .slide-leave-to {
    bottom:-30px;
    opacity: 0.001;
  }
  .slide-enter-active,
  .slide-leave-active { 
    transition: all 0.3s ease-in-out;
  }
  .slide-enter-active {
    transition-delay: 0.15s;
  }
</style>