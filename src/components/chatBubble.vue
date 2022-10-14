<script setup>
import { ref } from "vue";  

const streaming = ref();

const props = defineProps({
  msg: {
    type: String,
  },
  me:{
    type: Boolean,
  },
  name:{
    type: String,
  }
})


</script>

<template>
  <div class="flex" :class="{ 'me': props.me, 'them': !props.me }">
    <p v-if="!me" class="absolute left-5 font-extralight">{{name +':'}}</p>
    <p v-else class="absolute right-9 top-1 font-extralight">{{"Me:"}}</p>
    <h3 class="rounded-lg py-2 px-4 font-semibold mt-6 inline-block" :class="{ 'fromMe': props.me, 'fromthem': !props.me }">
      {{msg}}
    </h3>
  </div>
</template>

<style scoped>
  .fromMe{
    margin-right: 20px;
    background-color: #6366f1;
    color: white;
  }
  .fromthem{
    margin-left: 20px;
    background-color: #d4d4e4;
    color:#6366f1;
  }
  .me{
    justify-content:flex-end;
  }
  .them{
    justify-content:flex-start;
  }

</style>
