<script setup>
import { any } from 'webidl-conversions';
import { ref, onMounted, watch } from "vue";  

const streaming = ref();

const props = defineProps({
  text: {
    type: String,
  }
})

console.log(props.text);
</script>

<template>
  <div class="alert alert-success shadow-lg w-1/2 alertP bottom-2" >
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>{{text}}</span>
    </div>
  </div>
</template>

<style scoped>
.alertP{
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
