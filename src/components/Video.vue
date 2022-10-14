<script setup>
import { any } from 'webidl-conversions';
import { ref, onMounted, watch } from "vue";  
import { UserStore } from '../stores/user';

const streaming = ref();

const props = defineProps({
  strmObj: {
    type: MediaStream
  },
  conID:{
    type:String
  },
  userid:{
    type:String
  },
  me:{
    type:Boolean
  },
  room:{
    type:String
  }
})
console.log('smth///////////////////////////////' , props.strmObj.getTracks().find(track => track.kind == 'audio').enabled);
watch(()=>props.strmObj,(first,sec)=>{
  console.log('watcher vid');
  console.log(first);
  console.log(sec);
})
onMounted(()=>{
  let vid = ref();
  console.log(props.me);
  if (props.me)
  vid.muted = 'true';
})
</script>

<template>
  <div class="relative bg-white rounded-lg overflow-hidden ">
    <span class="absolute badge badge-lg z-10" :id="props.userid">{{props.conID}}</span>
    <video :muted = 'me' ref="vid" :srcObject.prop="strmObj" class="w-full z-0" style="{transform: rotateY(180deg);  -webkit-transform:rotateY(180deg); -moz-transform:rotateY(180deg);}" autoplay></video> 
    <span class="absolute badge badge-lg z-10 bottom-1 right-1" v-if="!props.strmObj.getTracks().find(track => track.kind == 'audio').enabled" :id="props.userid">muted</span>
  </div>

</template>

<style scoped>

</style>
