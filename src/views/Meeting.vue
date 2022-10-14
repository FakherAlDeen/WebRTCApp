<script setup>
import Video from "@/components/Video.vue";
import ChatBubble from "@/components/chatBubble.vue";
import Doc from "@/components/SharedDocYjs.vue";
import Modal from '../components/ModalInfo.vue';
import {  ref, onMounted,computed,watch } from "vue";
import { UserStore } from "../stores/user.js";
import {useRoute} from "vue-router";
import router from "../router/index.js";
const route = useRoute();
UserStore().pageImIn = 'meeting';
let room = route.params.RoomID;
let roomName = route.params.RoomName;
console.log(route.params);
console.log('room meeting' , room);
if(!UserStore().IsAGuest){
  UserStore().getNotificationList()
  UserStore().getRequestList();
}
const userS = UserStore();
const sidebar=ref(false);
const streaming = ref();
const chattxt= ref('');
const toggleCam = ref(true);
const Chatmsgs = ref([]);
//mic cam handling
const camTgl= ref(false);
const camText= ref('turn off cam');

const micTgl= ref(false);
const micText= ref('turn off Mic');

let MyMdeiaTrack=null;
UserStore().pageImIn='Meeting'

function CamToggle(){
        let track = MyMdeiaTrack.getTracks().find(track => track.kind == 'video');
        console.log('strmEvents',streaming.value);
        if (track.enabled ){
          track.enabled = false;
          camTgl.value = false;
          camText.value = 'turn on cam'
        }else if (!track.enabled){
          track.enabled = true;
          camTgl.value = true;
          camText.value = 'turn off cam'
        }
        // console.log('strm', track);
      }
      function MicToggle(){
        let Audiotrack = MyMdeiaTrack.getTracks().find(track => track.kind == 'audio');
        // console.log('audio',Audiotrack);
        if(Audiotrack.enabled){
          Audiotrack.enabled = false;
          micTgl.value = false;
          micText.value = 'turn on Mic'
        }else {
          Audiotrack.enabled = true;
          micTgl.value = true;
          micText.value = 'turn off Mic'
        }
      }


//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////Handling Document Opener////////////////////////////////////////////////////////
const openDoc= ref(false);
const openDocTab= ref(false);
const openListDocs= ref(false);
const documentRoom = ref(room);
const documentRoomName = ref(roomName);



function OpenHandlerDoc(roomID,RoomName){
  documentRoom.value = roomID;
  documentRoomName.value = RoomName;
  openDocTab.value = true;
  openListDocs.value=false;
}
function openDocHandler(){
  openDoc.value = !openDoc.value;
}

function openLastDocHandler (){
  if(UserStore().LastDocument){
    documentRoom.value = UserStore().LastDocument;
    documentRoomName.value = UserStore().LastDocumentName;
    openDocTab.value = true;
  }
}

function openDocListHandler(){
  openListDocs.value = true;
  // console.log(openListDocs.value);
}

function CreateNewOneHandler (){
  documentRoomName.value = roomName;
  UserStore().CreateDocument(roomName)
  let serverAns = null;
  watch(() => UserStore().ServerAns, (first, second) => {
    // console.log('first', first);
    // console.log('sec', second);

    serverAns=first;
    console.log('ser',serverAns);
        if(serverAns.stringAns == 'Done!'){
          documentRoom.value= serverAns.id;
        }
      })
      openDocTab.value = true;}

console.log(room)
let size =1;
const streamEvents=ref({});
let PCs = {};
PCs[userS.userID]={'name':userS.userDetails.Fname + ' ' + userS.userDetails.Lname}
const constraints = {
  video: {
    width: { max: 9000 },
    height: { max: 9000 },
    frameRate: { max: 100 },
  },
  audio: true,
};
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

onMounted(() => {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(async (stream) => {
      MyMdeiaTrack = stream
      userS.localStream = stream;
      streaming.value = stream;
      UserStore().streamEvents[userS.userID] = stream;
    })
    .then(() => {
      userS.setupSocket();
      // console.log('streams',MyMdeiaTrack)
    })
    .then(() => {
      // console.log("userS", userS);
      // console.log(userS.size);
      userS.socketW.on('connect', function(data) {
        userS.socketW.emit('msg', JSON.stringify({'room' : room , 'IsSDPICE':'no', 'from': userS.userID, 'to': 'any', 'name':userS.userDetails.Fname + ' ' + userS.userDetails.Lname}));
      });
      userS.socketW.on("datafromserv", (msg) => {
        // console.log(msg);
        MessageFromServ(msg);
        // console.log("PCs", JSON.stringify(PCs));
      });
    });
    UserStore().LastMeeting = room;
    UserStore().LastMeetingName = roomName;
});

async function MessageFromServ(msg) {
  var signal = JSON.parse(msg);
  let other = signal.from;
  // console.log(signal);
  if(signal.flag) return;
  if(signal.type){chatHandler(signal); console.log("wtv"); return;}
  if (
    other == userS.userID ||
    (signal.to != userS.userID && signal.to != "any")
  ) {
    // console.log("ret");
    return;
  }

  if (signal.to == "any") {
    // console.log("the 'any' state " , signal);
    setupPeer(other, room , signal.name);
    userS.socketW.emit(
      "msg",
      JSON.stringify({
        room: room,
        IsSDPICE: "no",
        from: userS.userID,
        to: other,
        name: userS.userDetails.Fname + " " + userS.userDetails.Lname,
      })
    );
  } else if (signal.IsSDPICE == "no" && signal.to == userS.userID) {
    // console.log("the to == name state " , signal);
    setupPeer(other, room, signal.name, true);
  } else if (signal.sdp) {
    // console.log("the SDP state " + signal);

    PCs[other].pc
      .setRemoteDescription(new RTCSessionDescription(signal.sdp))
      .then(function () {
        if (signal.sdp.type == "offer") {
          // console.log("SADGR");
          PCs[other].pc
            .createAnswer()
            .then((description) => CrtDesc(description, other,room));
        }
      });
  } else if (signal.ice) {
    // console.log("the ICE state " + signal);
    PCs[other].pc.addIceCandidate(new RTCIceCandidate(signal.ice));
  }
}

function setupPeer(ToID, room, name ,firstTime = false) {
  PCs[ToID] = { 'otherID': ToID, 'pc': new RTCPeerConnection(servers), 'name':name};
  PCs[ToID].pc.onicecandidate = (event) => gotIceCandidate(event, ToID, room);
  PCs[ToID].pc.ontrack = (event) => gotStreams(event,ToID);
  PCs[ToID].pc.oniceconnectionstatechange = (event) =>
    checkPeerDisconnect(event, ToID);
  PCs[ToID].pc.addStream(userS.localStream);

  if (firstTime) {
    PCs[ToID].pc
      .createOffer()
      .then((description) => CrtDesc(description, ToID, room));
  }
  // console.log('pcs',PCs);
}

function gotStreams(e,toID){
    UserStore().streamEvents[toID]=e.streams[0]; 
    console.log("stream ", streamEvents);
}
function gotIceCandidate(event, ToID, room) {
  if (event.candidate != null) {
    userS.socketW.emit(
      "msg",
      JSON.stringify({
        room: room,
        ice: event.candidate,
        to: ToID,
        from: userS.userID,
      })
    );
  }
}
function CrtDesc(description, ToID, room) {
  // console.log(`got description, peer ${ToID}`);
  PCs[ToID].pc.setLocalDescription(description).then(function () {
    // console.log("local set successfully ", description);
    if (PCs[ToID].pc.localDescription != null)
      userS.socketW.emit(
        "msg",
        JSON.stringify({
          room: room,
          sdp: PCs[ToID].pc.localDescription,
          from: userS.userID,
          to: ToID,
        })
      );
  });
}
function checkPeerDisconnect(event, ToID) {
  let state = PCs[ToID].pc.iceConnectionState;
  console.log(`connection with peer ${ToID} ${state}`);
  if (state === "failed" || state === "closed" || state === "disconnected") {
    document.getElementById(ToID).innerHTML="Disconnected!"
    delete PCs[ToID];
    delete UserStore().streamEvents[ToID]
    // console.log(UserStore().streamEvents.value);
  }
}
function chatHandler (signal){
  Chatmsgs.value.push({from:signal.from,
  msg:signal.msg,
  name:signal.name
  })
  console.log(Chatmsgs.value)
}

function clickChathandler(){
  sidebar.value=!sidebar.value;
}

function clickSendhandler(){
  if(chattxt.value=='') return;
  console.log(chattxt.value)
  let msg={
        room: room,
        type: "chat",
        from: userS.userID,
        name: userS.userDetails.Fname + " " + userS.userDetails.Lname,
        msg: chattxt.value
      }
  Chatmsgs.value.push({from:msg.from,
  'msg':msg.msg,
  name:msg.name
  })
  userS.socketW.emit(
      "msg",
      JSON.stringify(msg)
    );
  chattxt.value='';
}

function disconnectHandlerClick(){
  // console.log('my   pc', PCs);
  // console.log('my   pc', UserStore().userID);
  for (const val in PCs){
    console.log('val',val);
    if (val != UserStore().userID){
      PCs[val].pc.close()
    }
    delete streaming.value;
    console.log(streaming.value);
  }
  PCs = null;
  streaming.value = null;
  router.push('/list')
  
}
const openHistoryHandler = () => {
  router.push('/MeetingHistory')
}

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-end mb-5">
      <p class="text-3xl font-light mt-10 ml-10">Meeting <span class="font-light text-base text-gray-500">Room Name: '{{roomName}}'</span></p>
      <p class="font-light text-base text-gray-500 ml-4 mb-[1px]">Sharing ID: {{room}}</p>
      <button v-if="!UserStore().IsAGuest" @click="openHistoryHandler" class="btn absolute right-[9rem] top-[46%]">Meeting History</button>
    </div>
    <div class="bg-base-200 flex h-full">
      <div v-show="openDoc" class="bg-white m-5 rounded-3xl drop-shadow-xl" :class="{'w-1/3':UserStore().navBarOn, 'w-1/4':!UserStore().navBarOn}">
        <div v-if="!route.params.TakeMeWith && !openDocTab && !openListDocs" class='flex flex-col justify-center items-center justify-items-center content-center h-full'>
          <button class="btn m-5" @click="openLastDocHandler">open last document</button>
          <button class="btn m-5" @click="openDocListHandler">choose from your docs</button>
          <button class="btn btn-warning max-w-[70%] m-5" @click="CreateNewOneHandler">create a new one with the meeting</button>
        </div>
        <div v-else-if='route.params.TakeMeWith || openDocTab' class="w-full h-full">
          <button class= 'btn btn-ghost btn-circle absolute z-20 bottom-9 left-7' @Click="openDocTab=false">
            <img class="w-5 mr-1" src='../assets/svgs/left-arrow-svgrepo-com.svg'/>
          </button>
          <Doc :takemewithyou="false" @onClose="openDoc=false" :DocName="documentRoomName" :room="documentRoom" :withClose="true" :open='openDoc'/>
        </div>
        <div v-if ="openListDocs" class="w-full h-full">
          <div class="overflow-y-auto w-[90%] max-h-[40rem] mx-auto mt-5" v-if="UserStore().DocumentHistoryList.length>0">
              <table class="table w-full">
                  <!-- head -->
                  <thead>
                      <tr>
                          <th class="text-center">Document Name</th>
                          <th class="text-center">Actions</th>
                      </tr>
                  </thead>
                  <tbody class="bg-gray-200 text-center">
                      <template v-for="val in UserStore().DocumentHistoryList" :key="val">
                          <tr >
                              <td>{{val.Name}}</td>
                              <td>
                                  <button class="btn btn-xs m-1" @click="OpenHandlerDoc(val.RoomID,val.Name)">Open</button>
                              </td>
                          </tr>
                      </template>

                  </tbody>
              </table>
          </div>
          <h1 class="card-title text-slate-500 font-light text-base" v-else>You never made any document yet :c</h1>
          <button v-if="openListDocs" class= 'btn btn-ghost btn-circle fixed z-20 bottom-9 left-7' @Click="openListDocs=false">
            <img class="w-5 mr-1" src='../assets/svgs/left-arrow-svgrepo-com.svg'/>
          </button>
        </div>
      </div>
      <div 
      class="w-full h-fit max-h-[690px] grid m-auto gap-4 grid-cols-2 grid-rows-2 m-10"
      >
        <template v-for="(v,i) in UserStore().streamEvents" :key="i">
          <Video v-if="PCs[i].name" :strmObj="v" :conID="PCs[i].name" :userid="i" :me="i==UserStore().userID" :room='room'/>
          <!-- <p>{{"kys"}}</p> -->
        </template>
      </div>
      
      
      <Transition duration="550" name="slide">
        <div class="h-full w-1/3 bg-white fixed right-0 top-0 drop-shadow inner z-10" v-if="sidebar">
            <label class="btn btn-sm btn-circle absolute left-2 top-2" @click="clickChathandler">✕</label>
          <div class="flex flex-col h-5/6 relative top-20 items-center text-center">
            <div class="grow w-full overflow-auto" >
              <template v-for="V in Chatmsgs" :key="V">
                <ChatBubble :msg="V.msg" :me="V.from==userS.userID" :name="V.name"/>
              </template>
            </div>
            <div>
              <input type="text" placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs z-20 m-auto" v-model="chattxt"/>
              <button class="btn btn-active btn-primary w-1/4 mt-5" @click="clickSendhandler">Send!</button>
            </div>
          </div>
        </div>
      </Transition>
      <div class="absolute bottom-2 " :class="{'left-[30%]': !UserStore().navBarOn|| openDoc, 'left-[26%]': UserStore().navBarOn && !openDoc}">
        <button class="btn btn-error m-3" @click="disconnectHandlerClick">Disconnect</button>
        <button class="btn m-3" :class="{'btn-error': camTgl}" @click="CamToggle">{{camText}}</button>
        <button class="btn m-3" :class="{'btn-error': micTgl}" @click="MicToggle" >{{micText}}</button>
        <button class="btn m-3" :class="{'btn-error': openDoc}" @click="openDocHandler">Open Shared Document</button>
        <button class="btn m-3 btn-primary" @click="clickChathandler">chat!</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .slide-enter-from ,
  .slide-leave-to {
    transform: translateX(30px);
    opacity: 0.001;
  }
  .slide-enter-active,
  .slide-leave-active { 
    transition: all 0.3s ease-in-out;
  }
  .slide-enter-active {
    transition-delay: 0.25s;
  }
</style>
