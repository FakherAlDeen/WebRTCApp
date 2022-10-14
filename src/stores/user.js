import unstyledRtl from 'daisyui/dist/unstyled.rtl'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import {router} from '../router/index.js'
import { defineStore } from 'pinia'
import axios from 'axios'
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";


const baseUrl = "http://localhost:2023"

function setJwtToken(token) {
  sessionStorage.setItem("jwt", token)
}

function getJwtToken() {
  return sessionStorage.getItem("jwt")
}

export const UserStore = defineStore({
  id: 'counter',
  state: () => ({
    userToken: null,
    userDetails:null,
    PCs :{},
    google: false,
    localStream:null,
    socketW:null,
    userID:null,
    friends:[],
    request:[],
    serverans:null,
    guest:false,
    logged:false,
    streamEvents:{},
    pageImIn : 'Login',
    navBarOn : true,
    LastMeeting : null,
    LastDocument : null,
    LastMeetingName : null,
    LastDocumentName : null,
    MeetingHistory: [],
    DocumentHistory: [],
    mymeeting: null,
    Notify: [],
    Notifications: [],
  }),
  getters: {
    FriendList: (state) => state.friends,
    RequestList: (state) => state.request,
    ServerAns: (state) => state.serverans,
    WebSocket: (state) => state.socketW,
    IsAGuest: (state) => state.guest,
    isLoggedIN : (state) => state.logged,
    MeetingHistoryList:(state) => state.MeetingHistory,
    DocumentHistoryList:(state) => state.DocumentHistory,
    MyMeeting:(state) => state.mymeeting
  },
  actions: {
    checklogged(){
      if(this.guest || this.google){
        this.logged = true;
        return;
      } 
      if(getJwtToken()){
        this.logged = true;
        this.userToken = getJwtToken();
        this.userDetails = JSON.parse(atob(this.userToken.split('.')[1]));
        this.userID = this.userDetails.id;
      }
      else this.logged = false;
    },
    Login(msg){
      let res = null;
      axios.post(baseUrl + "/login",msg).then(response => (res=response.data)).then(()=>{
        try{
            this.guest = false;
            setJwtToken(res.data.token)
            this.userToken = getJwtToken();
            this.userDetails = JSON.parse(atob(this.userToken.split('.')[1]));
            this.userID = this.userDetails.id;
            // document.cookie = token = this.userToken
            router.push('/list');
        }
        catch{
          this.serverans = res;
        }
      }
      )
    },
    Signup_auth(msg,google){
      let res = null;
      // msg[id] = uuidv4();
      console.log(msg);
      axios.post(baseUrl + "/signup",msg).then(response => (res=response.data)).then(()=>{
          try{
            this.guest = false;
            setJwtToken(res.data.token)
            this.userToken = res.data.token;
            this.userDetails = JSON.parse(atob(this.userToken.split('.')[1]));
            this.userID = this.userDetails.id;
            setJwtToken(this.userToken)
            if(!google)
            router.push('/list');
          }
          catch{
            console.log(res);
            this.serverans = res;
          }
      }
      )
    },
    setupSocket(){
      this.socketW = io.connect('wss://fakher.13.development.maqsam.com', { transports: ['websocket', 'polling', 'flashsocket'] });
    },
    ConnectionSocket(channel,msg){
      console.log("channel" ,channel);
      console.log("msg" ,msg);
      this.socketW.on('connect', ()=>{
        this.socketW.emit(channel, msg);
      });
    },
    EmmitMsg(channel,msg){
      this.socketW.emit(channel, msg);
    }
    ,
    getFriendsList(){
      let res=null;
      console.log(this.userDetails.id)
      let msg = {id:this.userDetails.id}
      axios.post(baseUrl + "/friendslist",msg).then(response => (res=response.data)).then(()=>{
          this.friends = res
      }
      )
    },
    AddFriend(otheruser){
      let res=null;
      let msg = {User:this.userDetails.username, other:otheruser.toLowerCase() , id:this.userDetails.id}
      axios.post(baseUrl + "/addfriend",msg).then(response => (res=response.data)).then(()=>{
          // console.log('addfriend',res.string);
          this.serverans = res.string
      }
      ).then(()=>{
        this.getRequestList()
        this.EmmitMsg('OutOfMeeting',{type:'refresh', to:res.otherID , flag:true});
      })

    },
    getRequestList(){
      let res=null;
      console.log(this.userDetails.username)
      let msg = {id:this.userDetails.id}
      axios.post(baseUrl + "/RequestList",msg).then(response => (res=response.data)).then(()=>{
          console.log(res)
          this.request = res
      }
      )
      console.log(this.RequestList);
    },
    AcceptReq(other){
      let res=null;
      let msg = {id:this.userDetails.id, 'other' : other}
      axios.post(baseUrl + "/AcceptFriend",msg).then(response => (res=response.data)).then(()=>{
        console.log(res)
        this.getFriendsList();
        this.getRequestList();
        this.EmmitMsg('OutOfMeeting',{type:'refresh', to:other , flag:true});
      }
      );
    }
    ,RejectReq(other){
      let res=null;
      let msg = {id:this.userDetails.id, 'other' : other}
      axios.post(baseUrl + "/RejectFriend",msg).then(response => (res=response.data)).then(()=>{
        this.getRequestList();
        this.EmmitMsg('OutOfMeeting',{type:'refresh', to:other , flag:true});
      }
      )
    },
    Unfriend(other,chatID){
      let res=null;
      let msg = {id:this.userDetails.id, 'other' : other , 'chatID':chatID}
      axios.post(baseUrl + "/Unfriend",msg).then(response => (res=response.data)).then(()=>{
        this.getFriendsList();
        this.EmmitMsg('OutOfMeeting',{type:'refresh', to:other , flag:true});

      }
      )
    },getMsgs(chatID){
      let res=null;
      let msg = {'chatID':chatID}
      axios.post(baseUrl + "/GetChat",msg).then(response => (res=response.data)).then(()=>{
        console.log("chat", res);
        this.serverans = res
        console.log("server answer", this.ServerAns)
      })
    },loginAsAguest(){
      let res = null;
      this.logged = true;
      this.userID = uuidv4();
      this.userDetails = {
        "email": null,
        "username":this.userID,
        "Fname":'guest',
        "Lname":'',
        "password": ''
      };
      setJwtToken(this.userDetails);
      this.userToken = this.userDetails;
      this.guest = true;
      router.push('/list');
    },EditProf(data){
      console.log(this.userDetails);
      this.userDetails.username = data.username;
      this.userDetails.email = data.email;
      this.userDetails.Fname = data.Fname;
      this.userDetails.Lname = data.Lname;
      console.log(this.userDetails);

      let res=null;
      let msg = {'id' : this.userID, 'data': data}
      axios.post(baseUrl + "/Edit",msg).then(response => (res=response.data)).then(()=>{
        this.serverans = res
        console.log("server answer", this.ServerAns)
      })

    },changePass(old,newP){
      let res=null;
      let msg = {'id' : this.userID, 'pass': newP, 'old' :old}
      console.log(msg);
      axios.post(baseUrl + "/ChangePassword",msg).then(response => (res=response.data)).then(()=>{
        this.serverans = res
      })
    },SignOut(){
      this.pageImIn = 'Login'
      this.logged=false
      setJwtToken('');
      this.userToken = null;
      this.userDetails = null;
      this.PCs = {};
      this.localStream = null;
      this.socketW = null;
      this.userID = null;
      this.friends = [];
      this.request = [];
      this.serverans=null;
      window.location.replace('https://fakhermeets.13.development.maqsam.com/login')
    },Set_Credent_Google(data,token){
      this.google = true;
      this.logged = true;
      this.guest = false;
      this.userDetails = {
        'Fname':data.given_name,
        'Lname':data.family_name,
        'email':data.email,
        'username':data.name.trim(),
        'id' : data.email,
        'password' : 'uudsx'
      }
      this.Signup_auth(this.userDetails,true);
      setJwtToken(data)
      this.userID = data.jti;
      this.userToken = data.jti;
      router.push('/list')
    },
    CreateMeeting(roomName, Mymeeting = false){
      let RoomID = uuidv4()
      let msg ={
        'MeetingData':{
          RoomID,
          'Owner':this.userID,
          'usernameOwner':this.userDetails.username,
          'Name':roomName
        },
        'UserData':{
          'RoomId':RoomID
        },
        'userID':this.userID
      };
      let res = null;
      axios.post(baseUrl + "/createmeeting",msg).then(response => (res=response.data)).then(()=>{
        this.serverans = res;
        if(Mymeeting){
          this.mymeeting = res.id;
          console.log(this.mymeeting);
        }
        console.log(this.serverans);
      }
      )
    },
    CheckMeeting(RoomID){
      let res = null;
      axios.post(baseUrl + "/checkMeeting",{RoomID,'userID':this.userID ,'UserData':{'RoomId':RoomID}}).then(response => (res=response.data)).then(()=>{
        this.serverans = res;
        console.log(this.serverans);
      }
      )
    },
    CreateDocument(roomName){
      let RoomID = uuidv4()
      let msg ={
        'DocumentData':{
          RoomID,
          'Owner':this.userID,
          'usernameOwner':this.userDetails.username,
          'Name':roomName
        },
        'UserData':{
          'RoomId':RoomID
        },
        'userID':this.userID
      };
      let res = null;
      axios.post(baseUrl + "/createdocument",msg).then(response => (res=response.data)).then(()=>{
        this.serverans = res;
        console.log(this.serverans);
      }
      )
    },
    CheckDocument(RoomID){
      let res = null;
      axios.post(baseUrl + "/checkDocument",{RoomID,'userID':this.userID ,'UserData':{'RoomId':RoomID}}).then(response => (res=response.data)).then(()=>{
        this.serverans = res;
        console.log(this.serverans);
      }
      )
    },
    RetrieveDocument(RoomID){
      let res = null;
      axios.post(baseUrl + "/RetrieveDocument",{RoomID,'userID':this.userID}).then(response => (res=response.data)).then(()=>{
        this.serverans = res;
        console.log('Ret Doc',this.serverans.Document);
      }
      )
    },
    SaveDocument(RoomID,Doc){
      let res = null;
      axios.post(baseUrl + "/SaveDocument",{RoomID,Doc}).then(response => (res=response.data)).then(()=>{
        this.serverans = res;
        console.log(this.serverans);
      }
      )
    },
    getMeetingList(){
      let res=null;
      console.log(this.userDetails.id)
      let msg = {id:this.userDetails.id}
      axios.post(baseUrl + "/MeetingList",msg).then(response => (res=response.data)).then(()=>{
          this.MeetingHistory = res.sort(function(a,b){
            return new Date(b.LastTime) - new Date(a.LastTime);
          });
      }
      )
    },
    getDocumentList(){
      let res=null;
      console.log(this.userDetails.id)
      let msg = {id:this.userDetails.id}
      axios.post(baseUrl + "/DocumentList",msg).then(response => (res=response.data)).then(()=>{
          this.DocumentHistory = res.sort(function(a,b){
            return new Date(b.LastTime) - new Date(a.LastTime);
          });
      }
      )
    },
    getNotificationList(){
      let res=null;
      console.log(this.userDetails.id)
      let msg = {id:this.userDetails.id}
      axios.post(baseUrl + "/GetNotifications",msg).then(response => (res=response.data)).then(()=>{
          this.Notifications = res.reverse();
      }
      )
    },
    RejoinMeeting(RoomID,Name){
      console.log(RoomID);
      console.log(Name);

      router.push({
        name: 'meeting',
        params: {
            RoomName: Name,
            RoomID: RoomID
        }
    })

    }

  }
})
