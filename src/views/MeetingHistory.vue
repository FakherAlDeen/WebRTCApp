<script setup>
  import {UserStore} from "../stores/user.js"
  import {useRoute} from "vue-router";
  import {router} from '../router/index'
  UserStore().pageImIn = 'Meeting'
  if(!UserStore().IsAGuest)
    UserStore().getMeetingList();
  const route = useRoute();
  function RejoinHandler(RoomID,RoomName){
      UserStore().CheckMeeting(RoomID)
      router.push({
          name: 'meeting',
          params: {
              RoomName: RoomName,
              RoomID: RoomID
          }
      })
  }
  
  function openLastMeeting(){
      router.push({
        name: 'meeting',
        params: {
            RoomName: UserStore().LastMeetingName,
            RoomID: UserStore().LastMeeting
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
          <p class="text-3xl font-light mt-10 ml-10">Meeting History</p>
          <button v-if="UserStore().LastMeeting" @click="openLastMeeting" class="btn absolute right-[9rem] top-[46%]">Open Last Meeting</button>
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
          <template v-else-if="UserStore().MeetingHistoryList.length>0">
            <div class="flex justify-center">
              <div class="card bg-base-100 shadow-xl z-0 w-full ml-5 mr-10 h-fit mt-10 w-[90%]">
                  <div class="card-body items-center text-center w-full">
                      <h2 class="card-title">Your Meeting History</h2>
                      <div class="overflow-y-auto w-full max-h-[37rem]" v-if="UserStore().MeetingHistoryList.length>0">
                          <table class="table w-full">
                              <!-- head -->
                              <thead>
                                  <tr>
                                      <th class="text-center">Meeting Name</th>
                                      <th class="text-center">Creating Time</th>
                                      <th class="text-center">Last Time</th>
                                      <th class="text-center">CreatedBy</th>
                                      <th class="text-center">Sharing Link</th>
                                      <th class="text-center">Actions</th>
                                  </tr>
                              </thead>
                              <tbody class="bg-gray-200 text-center">
                                  <template v-for="val in UserStore().MeetingHistoryList" :key="val">
                                      <tr>
                                        <td>{{val.Name}}</td>
                                        <td>{{val.Created.split('T')[0]}}</td>
                                        <td>{{val.LastTime.split('T')[0]}}</td>
                                        <td>{{val.Owner}}</td>
                                        <td>{{val.RoomID}}</td>
                                        <td>
                                            <button class="btn btn-xs m-1" @click="RejoinHandler(val.RoomID,val.Name)">Rejoin</button>
                                        </td>
                                      </tr>
                                  </template>
  
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
            </div>
          </template>
          <div class="mt-[17%]" v-else>
            <p class="text-center text-3xl font-light mb-2">You Have no Meetings! Please Start one in the List page!</p>
            <img src ="../assets/svgs/ill6.svg" class="m-auto w-[35%] mb-0"/>
  
          </div>
        </div>
      </div>
  </template>
  
  <style scoped>
  
  </style>