<script setup>
import { ref,watch,toRef,onMounted } from "vue";  
import { UserStore } from "../stores/user.js";
import {useRoute} from "vue-router";
import alertInfo from "@/components/alert_info.vue";

const userS = UserStore();
const username = ref('');
const infos = ref('');
const props = defineProps({
  room: {
    type: String,
  },
  withClose:{
    type:Boolean,
  },Style:{
    type:String
  },open:{
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
const route = useRoute();
const alert = ref(false);
const alertText = ref('');
let room = props.room;
console.log(room)
function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}
function delStr(str,index,index2){
    return str.substr(0,index)+ str.substr(index2+1)
}
const text = ref('');
let flag = true;
UserStore().setupSocket();
UserStore().ConnectionSocket('createRoom',{type:'textArea', from:UserStore().userID, room:room, text:text.value});
UserStore().WebSocket.on('TextAreaSock', (data)=>{
    MessagesFromSocketHandler(data);
})
onMounted(()=>{
    console.log('hi');
    UserStore().EmmitMsg('TextArea',{room:room, type:'someoneConnected' ,from : UserStore().userID , name:UserStore().userDetails.Fname + ' ' + UserStore().userDetails.Lname})
})
function MessagesFromSocketHandler(data){
    console.log('msg' , data);
    if(UserStore().userID == data.from ) return;
    flag = false;
    if(data.type == 'TextAreaChange'){
        if(data.action == 'add')
            {
            console.log('wtv',insert (text.value.toString(),data.index,data.char))
            text.value = insert (text.value.toString(),data.index,data.char)
            }
        else if (data.action == 'delete')
            text.value = delStr (text.value.toString(),data.index,data.index2-1)

    }
    else if (data.type == 'someoneConnected'){
        alertText.value = data.name + ' connected!';
        alert.value = true;
        setTimeout(() => {
            alert.value = false;
        }, '3000');
        UserStore().EmmitMsg('TextArea',{room:room, text:text.value, type:'someoneConnectedReply'});
    }
    else if (data.type == 'someoneConnectedReply'){
        text.value = data.text
    }

}
watch(text, async (newQuestion, oldQuestion) => {
  if (!flag) {console.log('return!'); flag = true; return;}
  console.log('new', newQuestion);
  console.log('old', oldQuestion);
  let start = document.getElementById('wtv').selectionStart;
  let end = document.getElementById('wtv').selectionEnd;
  let index = start;
  let index2 = end;
  console.log('start',start);
  console.log('end',end);

//   console.log('sbtstr',newQuestion.substr(index-newQuestion.length+oldQuestion.length,index));
  let val;
  let action = null;
  if(newQuestion.length > oldQuestion.length)
  {
    index = start-newQuestion.length+oldQuestion.length;
    if(index == 0 && start-1 == 0) val=newQuestion.charAt(0);
    else val = newQuestion.substr(index,newQuestion.length-oldQuestion.length);
    console.log('val',val);
    action = 'add';
  }
  else {
    index2 = index+oldQuestion.length-newQuestion.length
    action = 'delete'
  }
  if (document.getElementById('wtv').selectionStart != document.getElementById('wtv').selectionEnd && action == 'add'){
    val = text.value.substr(index,index2);
  }

  let data = {
    'index': index,
    'index2' : index2,
    'char' : val,
    'room' : room,
    'from' : UserStore().userID,
    'action' : action,
    'type' : 'TextAreaChange'
  }
  UserStore().EmmitMsg('TextArea',data);
})
function handlerTextArea (){
    flag = true;
}

</script>

<template>
  <div class="w-full h-full">
    <label v-if="withClose" for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2 z-10" @click="CloseHandler; emit('onClose')" >✕</label>
      <div class="flex z-0 w-full h-full">
          <textarea id="wtv" :class="Style" class="textarea w-full h-full" placeholder="Enter you Text" @input="handlerTextArea" v-model="text"></textarea>
      </div>
    </div>
    <Transition duration="350" name="slide">
        <template v-if ="alert==true">
            <alert-info :text = "alertText"/>
        </template>
    </Transition>
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