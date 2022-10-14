<script setup>
import { ref,watch,toRef,onMounted } from "vue";  
import { UserStore } from "../stores/user.js";
import {router} from '../router/index.js'
import {useRoute} from "vue-router";
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import 'quill/dist/quill.snow.css'


import alertInfo from "@/components/alert_info.vue";


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
  },takemewithyou:{
    type: Boolean
  },RoomName:{
    type: String,
  },DocName:{
    type : String,
  }
})
const ydoc = new Y.Doc()
let ytext;
onMounted(()=>{
  Quill.register('modules/cursors', QuillCursors)
  
  const quill = new Quill(document.querySelector('#editor'), {
    modules: {
      cursors: true,
      toolbar: [
        // adding some basic Quill content features
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ],
      history: {
        // Local undo shouldn't undo changes
        // from remote users
        userOnly: true
      }
    },
    placeholder: 'Start collaborating...',
    theme: 'snow' // 'bubble' is also great
  }
  )
  UserStore().RetrieveDocument(props.room);
  watch(() => UserStore().ServerAns, (first, second) => {
      console.log(
        "Watch props.selected function called with args:",
        first,
        second
        );
      if(first.Document){
        let x=new Uint8Array(first.Document.split(','))
        console.log(x);
        Y.applyUpdate(ydoc,x)
    }

    });
  const userS = UserStore();
  const username = ref('');
  const infos = ref('');
  
  const provider = new WebsocketProvider(
    'wss://y.13.development.maqsam.com', ''+props.room, ydoc
    )
  ytext = ydoc.getText('quill')
  const binding = new QuillBinding(ytext, quill, provider.awareness)
  window.addEventListener('blur', () => { quill.blur() })
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
    closeOpen.value=first;
    });
console.log(props.open)
console.log(closeOpen.value)
function CloseHandler(){
  closeOpen.value=false
}
function SaveClickBtn(){
  UserStore().SaveDocument(props.room,Y.encodeStateAsUpdate(ydoc).toString('hex'))
}
const route = useRoute();
const alert = ref(false);
const alertText = ref('');
let room = props.room;
let take = false;
function TakeMeHandler(){
  UserStore().CreateMeeting(props.RoomName)
  console.log(UserStore().ServerAns);
  router.push({
      name: 'meeting',
      params: {
          RoomName: props.RoomName,
          RoomID: props.room,
          TakeMeWith : true,
      }
  })
  }
</script>

<template>
  <button v-if="takemewithyou && !withClose" class="absolute bottom-10 left-10 z-10 btn btn-ghost font-light text-lg" @click="TakeMeHandler();">Take me to a meeting</button>
  <button class="absolute bottom-10 right-10 z-10 btn btn-ghost font-light text-lg" @click="SaveClickBtn">Save</button>
  <h1 v-if="withClose == true" class="m-2 mt-4 ml-4 font-light text-lg"> <span class="font-base">Document Name: </span>{{DocName}}</h1>
  <div :class="{'max-h-[33vw] overflow-y-auto' : !takemewithyou}">
    <div class="z-0 " id="editor">
    </div>
  </div>
  <Transition duration="350" name="slide">
      <template v-if ="alert==true">
          <alert-info :text = "alertText"/>
      </template>
  </Transition>
</template>

<style scoped>
   .ql-toolbar.ql-snow{
    margin-top:12px ;
    border-width : 0px !important;
  }
  .ql-container.ql-snow {
    border-width : 0px !important;
    overflow-y: auto !important;
    height: 82% !important;
  }
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