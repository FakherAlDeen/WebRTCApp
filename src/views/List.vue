<script setup>
import { ref,onMounted,watch } from "vue";
import {UserStore} from "../stores/user.js"
import {router} from '../router/index.js'
import ChatBubble from "@/components/chatBubble.vue";
import axios from 'axios'
import ModalFriend from '../components/ModalForFriend.vue';
import Modal from '../components/ModalInfo.vue';
import { invokeArrayFns } from "@vue/shared";

const baseUrl = "http://localhost:2023"
UserStore().pageImIn='List'

if(!UserStore().IsAGuest){
    UserStore().setupSocket();
    UserStore().ConnectionSocket('createRoom',{type:'OutOfMeeting', id:UserStore().userDetails.id});
    UserStore().getFriendsList();
    UserStore().getRequestList();
    UserStore().getNotificationList()
    UserStore().WebSocket.on('MesagesNoMeeting', (data)=>{
        MessagesFromSocketHandler(data);
    })
    UserStore().getDocumentList();
    UserStore().getMeetingList();
}

//All Refs
const RoomNameInvite= ref();
const usernameInvite = ref();
const Chatmsgs = ref({});
const chattxt= ref('');
const ActiveChatId= ref("");
const ActiveChatuserID = ref("");
const chatTitle = ref("");
const sidebar = ref(false);
const openFriendModal= ref(false);
const room = ref ('');
const openInviteModal= ref(false);
const Gotinvitedtxt=ref('');
const openReplyInviteModal= ref(false);
const ReplyInviteTxt = ref('');
const ReplyInviteHeader = ref('');
const DocRoom = ref('');
const roomInfo = ref('');
const DocsInfo = ref('');
const MeetingHeader= ref('Enter your Sharing ID');
const MeetingBtn= ref('Join a meeting');
const DocumentHeader= ref('Enter your Sharing ID');
const DocumentBtn= ref('Join a Document');
const ActiveMeetingBtn = ref('Join')
const ActiveDocumentBtn = ref('Join')
const JoinActiveMeeting = ref(true)
const JoinActiveDocument = ref(true)

const CreateMeetingClick = ()=>{
    MeetingHeader.value = 'Enter you Room name to create'
    MeetingBtn.value = 'Create a meeting'
    ActiveMeetingBtn.value='Create'
    JoinActiveMeeting.value = false

}

const JoinMeetingClick = ()=>{
    MeetingHeader.value = 'Enter your Sharing ID'
    MeetingBtn.value = 'Join a meeting'
    ActiveMeetingBtn.value='Join'
    JoinActiveMeeting.value = true
}

const CreateDocumentClick = ()=>{
    DocumentHeader.value = 'Enter you Room name to create'
    DocumentBtn.value = 'Create a Document'
    ActiveDocumentBtn.value='Create'
    JoinActiveDocument.value = false
}

const JoinDocumentClick = ()=>{
    DocumentHeader.value = 'Enter your Sharing ID'
    DocumentBtn.value = 'Join a Document'
    ActiveDocumentBtn.value='Join'
    JoinActiveDocument.value = true
}

setupChatMsgs()
//Functions
async function clickDocHandler(){
    if(DocRoom.value=='') DocsInfo.value="please enter the room you wanna enter or create!";
    else {
        if(ActiveDocumentBtn.value == 'Create'){
            await UserStore().CreateDocument(DocRoom.value)
            let serverAns = null;
            watch(() => UserStore().ServerAns, (first, second) => {
                console.log('first', first);
                console.log('sec', second);

                serverAns=first;
                console.log('ser',serverAns);
                if(serverAns.stringAns == 'Done!')
                router.push({
                        name: 'docs',
                        params: {
                            RoomName: DocRoom.value,
                            RoomID: serverAns.id
                        }
                    })
            });
        }else {
            UserStore().CheckDocument(DocRoom.value)
            let serverAns = null;
            watch(() => UserStore().ServerAns, (first, second) => {
                console.log('first', first);
                console.log('sec', second);

                serverAns=first;
                console.log('ser',serverAns);
                if(serverAns.stringAns == 'Done!')
                router.push({
                        name: 'docs',
                        params: {
                            RoomName: serverAns.name,
                            RoomID: serverAns.id
                        }
                    })
                else DocsInfo.value = serverAns.stringAns
            });
        }
    }
}
async function setupChatMsgs(){
    let elements =await UserStore().FriendList
    console.log(elements)
    for (let i=0 ; i< elements.length ; i++){
        Chatmsgs.value[elements[i].chatID] = '';
    }
    console.log(Chatmsgs.value)
}
function MessagesFromSocketHandler(msg){
    console.log(msg);
    if(msg.type == 'refresh'){
        UserStore().getRequestList();
        UserStore().getFriendsList();
        UserStore().getNotificationList();
        return;
    }else if (msg.type == 'chatOutOfMeeting')
    chatHandler(msg)
    else if (msg.type == 'invite'){
        invitModalTrigger(msg)
        if(UserStore().pageImIn!='List')
            UserStore().Notify.push(msg)
    }
    else if (msg.type == 'ReplyInvite'){
        ReplyinviteModalTrigger(msg)
        if(UserStore().pageImIn!='List')
            UserStore().Notify.push(msg)
    }
}
function chatHandler (signal){
  Chatmsgs.value[signal.chatID].push({from:signal.from,
  msg:signal.msg,
  name:signal.name
  })
  console.log(Chatmsgs.value)
}
async function getmgs(chatID){
    let res=null;
    let msg = {'chatID':chatID}
    axios.post(baseUrl + "/GetChat",msg).then(response => (res=response.data)).then(()=>{
        console.log("chat", res);
        Chatmsgs.value[chatID]=res
    })
}
async function clickChathandler(Fname,Lname,chatID,id){
    ActiveChatId.value = chatID;
    chatTitle.value = Fname+' '+Lname;
    ActiveChatuserID.value = id;
    await getmgs(chatID)
    console.log(UserStore().ServerAns)
    console.log('chatarray',Chatmsgs.value)
    sidebar.value=!sidebar.value;
}
function clickSendhandler(){

  if(chattxt.value=='') return;
  console.log(chattxt.value)
  console.log('chat',Chatmsgs.value)

  let msg={
        'type':'chatOutOfMeeting',
        'msg': chattxt.value,
        'from':UserStore().userDetails.id,
        'name': UserStore().userDetails.Fname + ' ' + UserStore().userDetails.Lname,
        'to' : ActiveChatuserID.value,
        flag:true,
        'chatID':ActiveChatId.value
      }
  console.log(msg);
  if (!Chatmsgs.value[ActiveChatId.value]) {
    Chatmsgs.value[ActiveChatId.value] = [];
  }
  Chatmsgs.value[ActiveChatId.value].push({from:msg.from,
  'msg':msg.msg,
  name:msg.name
  })
  UserStore().EmmitMsg('OutOfMeeting' , msg);
  chattxt.value='';
}
function ExitChatHandler(){
    sidebar.value=!sidebar.value;
}
async function click(){
    if(room.value=='') {roomInfo.value="please enter the room you wanna enter or create!"; return;}
    else {
        if(ActiveMeetingBtn.value == 'Create'){
            await UserStore().CreateMeeting(room.value)
            let serverAns = null;
            watch(() => UserStore().ServerAns, (first, second) => {
                console.log('first', first);
                console.log('sec', second);

                serverAns=first;
                console.log('ser',serverAns);
                if(serverAns.stringAns == 'Done!')
                router.push({
                        name: 'meeting',
                        params: {
                            RoomName: room.value,
                            RoomID: serverAns.id
                        }
                    })
            });
        }else {
            UserStore().CheckMeeting(room.value)
            let serverAns = null;
            watch(() => UserStore().ServerAns, (first, second) => {
                console.log('first', first);
                console.log('sec', second);

                serverAns=first;
                console.log('ser',serverAns);
                if(serverAns.stringAns == 'Done!')
                router.push({
                        name: 'meeting',
                        params: {
                            RoomName: serverAns.name,
                            RoomID: serverAns.id
                        }
                    })
                else roomInfo.value = serverAns.stringAns
            });
        }
    }
}
function AddClickHandler(){
    openFriendModal.value=true
}
const servAns = ref();
async function inviteHandler(id){
    let msg= null;
    if (!UserStore().MyMeeting){
        UserStore().CreateMeeting(UserStore().userDetails.username + ' Meeting',true);
        watch(() => UserStore().MyMeeting, (first, second) => {
            servAns.value = first;
            console.log(servAns.value);
            msg={
            'type':'invite',
            'from':UserStore().userDetails.id,
            'username': UserStore().userDetails.username,
            'name': UserStore().userDetails.Fname + ' ' + UserStore().userDetails.Lname,
            'to': id,
            'room': UserStore().MyMeeting,
            'roomName' : UserStore().userDetails.username + ' Meeting',
            flag:true
            }
            UserStore().EmmitMsg('OutOfMeeting',msg);
        });
        console.log(servAns.value);
    }else{
        msg={
        'type':'invite',
        'from':UserStore().userDetails.id,
        'username': UserStore().userDetails.username,
        'name': UserStore().userDetails.Fname + ' ' + UserStore().userDetails.Lname,
        'to': id,
        'room': UserStore().MyMeeting,
        'roomName' : UserStore().userDetails.username + ' Meeting',
        flag:true
        }
        UserStore().EmmitMsg('OutOfMeeting',msg);
    }
}
function invitModalTrigger(msg){
    usernameInvite.value = msg.from
    Gotinvitedtxt.value = "You got invited to a meeting by " + msg.name;
    openInviteModal.value = true;
    RoomNameInvite.value = msg.roomName
    room.value = msg.room;
}
function ReplyinviteModalTrigger(msg){
    ReplyInviteHeader.value ='<span class= "text-blue-600 font-bold text-lg">' + msg.name +'</span> Accepted you invitation';
    ReplyInviteTxt.value = 'you can Go to the meeting now or use this Room ID: <span class= "text-red-600"> <br>' +msg.room +'</span> to enter Later';
    room.value = msg.room;
    RoomNameInvite.value = msg.roomName
    openReplyInviteModal.value = true;
}
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
</script>

<template >
    <div class="z-0 h-full flex flex-col">
    <p class="text-3xl font-light mt-10 ml-10 mb-5">Dashboard</p>
    <div class="flex w-full h-full bg-base-200">
        <div class="w-[80vw]">
            <div class="card bg-base-100 shadow-xl z-0 w-full ml-5 mr-10 h-fit mt-10 overflow-hidden">
                <div class="card-body items-center text-center w-full">
                    <h2 class="card-title">Your Friend list</h2>
                    <div class="overflow-y-auto w-full max-h-[12rem]" v-if="UserStore().FriendList.length>0">
                        <table class="table w-full">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th class="text-center">First Name</th>
                                    <th class="text-center">Last Name</th>
                                    <th class="text-center">Username</th>
                                    <th class="text-center">Actions</th>
                                    <th class="text-center"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-gray-200">
                                <template v-for="val in UserStore().FriendList" :key="val">
                                    <tr >
                                            <td>{{val.Fname}}</td>
                                            <td>{{val.Lname}}</td>
                                            <td>{{val.username}}</td>
                                        <td>
                                            <button class="btn btn-xs m-1" @click="clickChathandler(val.Fname,val.Lname,val.chatID,val.id)">chat</button>
                                            <button class="btn btn-xs btn-error m-1" @click="UserStore().Unfriend(val.id,val.chatID)">Unfriend</button>
                                        </td>
                                        <td>
                                            <button class="btn btn-xs m-1 btn-ghost" @click="inviteHandler(val.id)">invite</button>
                                        </td>
                                    </tr>
                                </template>

                            </tbody>
                        </table>
                    </div>
                    <h1 class="card-title text-slate-500 font-light text-base" v-else>There are no friends :c</h1>
                    <button class="btn btn-primary mt-2 border-b-4 border-[#2c3551]" @click="AddClickHandler">Add a Friend</button>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl z-0 w-full ml-5 mr-10 h-fit mt-10 overflow-hidden">
                <div class="card-body items-center text-center w-full">
                    <h2 class="card-title">Your Meeting History</h2>
                    <div class="overflow-y-auto w-full max-h-[10rem]" v-if="UserStore().MeetingHistoryList.length>0">
                        <table class="table w-full">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th class="text-center">Meeting Name</th>
                                    <th class="text-center">Last Time</th>
                                    <th class="text-center">CreatedBy</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-gray-200 text-center">
                                <template v-for="val in UserStore().MeetingHistoryList" :key="val">
                                    <tr >
                                            <td>{{val.Name}}</td>
                                            <td>{{val.LastTime.split('T')[0]}}</td>
                                            <td>{{val.Owner}}</td>
                                        <td>
                                            <button class="btn btn-xs m-1" @click="RejoinHandler(val.RoomID,val.Name)">Rejoin</button>
                                        </td>
                                    </tr>
                                </template>

                            </tbody>
                        </table>
                    </div>
                    <h1 class="card-title text-slate-500 font-light text-base" v-else>You never attended any meeting yet :c</h1>
                </div>
            </div>
        </div>
        <div class="flex">
            <div class="flex-1 flex-col m-5 w-full box-border">
                <div class=" max-w-[23rem] w-[23rem] card h-fit bg-base-100 drop-shadow-xl m-5 z-0 bg-[#79cfcd] mt-5 my-auto box-border">
                    <div class="flex w-full justify-center space-x-2 mt-3">
                        <button 
                        class="btn btn-ghost bg-[hsl(179,47%,50%)] text-white mt-2 px-8 border-b-4 border-white"
                         :class="{ 'btn-active': JoinActiveMeeting}" 
                         @click="JoinMeetingClick">Join</button>
                        <button 
                        class="btn btn-ghost bg-[hsl(179,47%,50%)] mt-2 text-white px-10 border-b-4 border-white"
                        :class="{ 'btn-active': !JoinActiveMeeting}"
                        @click="CreateMeetingClick">Create</button>
                    </div>
                    <div class="card-body items-center text-center m-auto box-border pt-2 pb-4">
                        <h2 class="card-title text-white">{{MeetingHeader}}</h2>
                        <p v-if="roomInfo!=''" class="text-red-700">{{roomInfo}}</p>
                        <input type="text" placeholder="vidoe room" class="input w-full max-w-xs" v-model="room"/>
                        <button class="btn mt-2 border-b-4 border-white" @click="click">{{MeetingBtn}}</button>
                    </div>
                </div>
                <div class="card w-fit h-fit max-w-[23rem] w-[23rem] bg-base-100 drop-shadow-xl mx-5 h-full z-0 bg-[#f14e6d] mt-5 my-auto">
                    <div class="flex w-full justify-center space-x-2 mt-3">
                        <button 
                        class="btn btn-ghost bg-transparent text-white mt-2 px-8 border-b-4 border-white" 
                        :class="{ 'btn-active': JoinActiveDocument}"
                        @click="JoinDocumentClick">Join</button>
                        <button class="btn btn-ghost bg-transparent mt-2 text-white px-10 border-b-4 border-white" 
                        :class="{ 'btn-active': !JoinActiveDocument}"
                         @click="CreateDocumentClick">Create</button>
                    </div>
                    <div class="card-body items-center text-center m-auto pt-2 pb-4">
                        <h2 class="card-title text-white">{{DocumentHeader}}</h2>
                        <p v-if="DocsInfo!=''" class="text-red-700">{{DocsInfo}}</p>
                        <input type="text" placeholder="Document room" class="input w-full max-w-xs" v-model="DocRoom"/>
                        <div class="card-actions">
                            <button class="btn mt-3 border-b-4 border-white" @click="clickDocHandler">{{DocumentBtn}}</button>
                        </div>
                    </div>
                </div>
                <div class="card bg-base-100 shadow-xl max-w-[23rem] w-[23rem] mx-5 h-fit z-0 m-5">
                <div class="card-body items-center text-center m-auto w-full">
                    <h2 class="card-title">Your Request List</h2>
                    <div class="overflow-y-auto w-full max-h-[5rem]" v-if="UserStore().RequestList.length>0">
                        <table class="table w-full">
                            <!-- head -->
                            <thead>
                            <tr>
                                <th>Username</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                <template v-for="val in UserStore().RequestList" :key="val">
                                <tr>
                                    <td>{{val.username}}</td>
                                    <td>
                                        <template v-if="val.type=='gotfrom'">
                                            <button class="btn btn-xs m-1 btn-success" @click="UserStore().AcceptReq(val.id)">Accept</button>
                                            <button class="btn btn-xs m-1 btn-error" @click="UserStore().RejectReq(val.id)">Reject</button>
                                        </template>
                                        <h1 class="card-title text-slate-500 font-extralight text-base" v-else>Pending</h1>
                                    </td>
                                </tr>
                                </template>

                            </tbody>
                        </table>
                    </div>
                    <h1 class="card-title text-slate-500 font-light text-base" v-else>There are no Requests</h1>
                </div>
            </div>
            </div>
            <Transition duration="550" name="slide">
                <div class="h-full w-1/3 bg-white fixed right-0 bottom-0 drop-shadow-xl inner z-50" v-if="sidebar">
                    <h2 class="card-title font-light ml-14 mt-12 text-2xl">{{"chat with "}} <span class="text-blue-500 font-medium">{{chatTitle}}</span></h2>
                    <label class="btn btn-sm btn-circle absolute left-2 top-2" @click="ExitChatHandler">✕</label>
                    <div class="flex flex-col h-5/6 relative top-10 items-center text-center">
                    <div class="grow w-full overflow-auto" >
                    <template v-for="V in Chatmsgs[ActiveChatId]" :key="V">
                        <ChatBubble :msg="V.msg" :me="V.from==UserStore().userDetails.id" :name="V.name"/>
                    </template>
                    </div>
                    <div>
                    <input type="text" placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs z-20 m-auto" v-model="chattxt"/>
                    <button class="btn btn-active btn-primary w-1/4 mt-5" @click="clickSendhandler">Send!</button>
                    </div>
                    </div>
                </div>
            </Transition>
            
        </div>
        <Modal @onClose="openReplyInviteModal = false" :RoomName="RoomNameInvite" :room="room" :Header="ReplyInviteHeader" :txt="ReplyInviteTxt"  btn="Not now" btn2="Go to meeting" :withBtn1="true" :withBtn2="true" FuncBtn1="justClose" FuncBtn2="ReplyInivte" :open="openReplyInviteModal"/>
        <Modal @onClose="openInviteModal = false" :RoomName="RoomNameInvite" :room="room" :usernameInvite="usernameInvite" :Header="Gotinvitedtxt" txt="Click accept to enter!"  btn="Deny" btn2="Accept" :withBtn1="true" :withBtn2="true" FuncBtn1="justClose" FuncBtn2="AcceptInivte" :open="openInviteModal"/>
        <Modal v-if="UserStore().IsAGuest" @onClose="openFriendModal = false" Header="You can't add a friend" txt="you have to be logged in to do that!" btn="SignUp" btn2="Login" :withBtn1="true" :withBtn2="true" FuncBtn1="SignUp" FuncBtn2="LogIn" :open="openFriendModal"/>
        <ModalFriend v-if="!UserStore().IsAGuest" @onClose="openFriendModal = false" Header="Add a Friend!" txt="The only thing we need is their username!" btn="cancel" btn2="Send!" :open="openFriendModal"/>
        
    </div>
</div>
</template>


<style scoped>
    .width-card{
        width: calc(100% - 40px);
    }
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
