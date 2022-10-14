<script setup>
import { ref,watch,toRef } from "vue";  
import { UserStore } from "../stores/user.js";

const userS = UserStore();
const username = ref('');
const infos = ref('');
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
  }
})
const emit = defineEmits(['onClose'])
const closeOpen= ref(props.open)
console.log(open.value)
watch(() => props.open, (first, second) => {
      console.log(
        "Watch props.selected function called with args:",
        first,
        second
      );
    username.value = "";
    closeOpen.value=first;
    });
console.log(props.open)
console.log(closeOpen.value)
function CloseHandler(){
  closeOpen.value=false
}

function AddHandler(){
  if (username.value == '') {infos.value="invalid empty username!"; return;}
  userS.AddFriend(username.value);
   watch(() => userS.ServerAns, (first, second) => {
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
  <div class="modal" :class="{'modal-open': closeOpen}" id="my-modal-2">
  <div class="modal-box">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2" @click="CloseHandler; emit('onClose')" >✕</label>
    <h3 class="font-bold text-lg">{{Header}}</h3>
    <p class="py-4">{{txt}}</p>
    <p v-if="infos!=null || infos!=''" class="text-red-500">{{infos}}</p>
    <input type="text" placeholder="Type here" class="input input-bordered w-full " v-model="username"/>
    <div class="modal-action">
     <a class="btn btn-error" @click="CloseHandler; emit('onClose')">{{btn}}</a>
     <a class="btn btn-success" @click="AddHandler">{{btn2}}</a>
    </div>
  </div>
</div>
</template>

<style scoped>
</style>
