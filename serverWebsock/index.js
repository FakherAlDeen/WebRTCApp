// express inti
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const uuid = require('uuid');

var cors = require('cors');
app.use(express.json());
app.use(cors(corsOptions));
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // For legacy browser support
}

// jwt 
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {createRecordUser, FindOneUserRecord, sendRequest, addFriend, DeleteFriend,DeleteReq, UpdateRecord} = require("./userModel");
const {createRecordChat, FindOneChatRecord, DeleteChatRecord,PushMsg} = require("./chatModel");
const {createDocument, FindOneDocRecord, DeleteDocRecord,UpdateDocRecord} = require("./DocumentModel");
const {createMeeting, FindOneMeetingRecord,UpdateMeetingRecord, DeleteMeetingRecord} = require("./MeetingModel");


// socket io server
const { Server } = require("socket.io");
// body parser for body req
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// app use
app.use(bodyParser.urlencoded({
    extended: true
  }));
let users = {
  "ahmad@wtv.com" : {
    Fname: "ahmad",
    Lname: "moh",
    password:"wtv",
    email: "ahmad@wtv.com",
    friends:{
      1: "moh@ss.com",
      2: "tst.com"
    },
    requests:{
      
    }
  },
  "tst.com" : {
    Fname: "ahmad",
    Lname: "moh",
    password:"tst",
    email: "tst.com",
    friends:{
      1: "moh@ss.com",
      2: "ahmad@wtv.com",
    },
    requests:{

    }
  },
  "moh@ss.com" : {
    Fname: "moh",
    Lname: "ahmad",
    password:"eww",
    email:"moh@ss.com",
    friends:{
      1: "tst.com"
    },
    requests:{
      
    }
  }
}

//Queue implementation
class Queue {
  constructor() {
    this.items = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }
  enqueue(item) {
    this.items[this.tailIndex] = item;
    this.tailIndex++;
  }
  dequeue() {
    const item = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return item;
  }
  peek() {
    return this.items[this.headIndex];
  }
  get length() {
    return this.tailIndex - this.headIndex;
  }
}

let queue = new Queue();
//////////////MeetingHandlers/////////////////////////
app.post("/createmeeting",async (req, res, next) => {
  console.log(req.body);
  await createMeeting(req.body.MeetingData)
  await UpdateRecord(req.body.userID,{'$addToSet':{'MeetingHistory':req.body.UserData.RoomId}})
  let ans = {'stringAns':'Done!', 'id':req.body.MeetingData.RoomID}
  console.log(ans);
  res.send(ans)
});
app.post("/checkMeeting",async (req, res, next) => {
  const Meeting = await FindOneMeetingRecord({RoomID:req.body.RoomID})
  // console.log(Meeting[0].Name);
  if(!Meeting[0]){
    res.send({'stringAns' : 'there is no meeting with that ID!'})
    return;
  }
  await UpdateRecord(req.body.userID,{'$addToSet':{'MeetingHistory':req.body.UserData.RoomId}})
  await UpdateMeetingRecord(req.body.RoomID,{'lastAcces':Date.now()})
  res.send({'stringAns':'Done!', 'id':req.body.RoomID , 'name': Meeting[0].Name})
});

app.post("/MeetingList", async (req, res) => {
  let user = await FindOneUserRecord({'id':req.body.id});
  let data = [];
  let MeetingData= null;
  for(var x in user[0].MeetingHistory){
    let Meeting = await FindOneMeetingRecord({'RoomID':user[0].MeetingHistory[x]});
    console.log(x);
    console.log(Meeting[0]);
    MeetingData = {
      RoomID:user[0].MeetingHistory[x],
      Name:Meeting[0].Name,
      Owner:Meeting[0].usernameOwner,
      Created:Meeting[0].createdat,
      LastTime:Meeting[0].lastAcces
    }
    data.push(MeetingData)
  }
  res.send(data)
});

/////////////DocumentHandlers//////////////////////////
app.post("/createdocument",async (req, res, next) => {
  console.log(req.body);
  await createDocument(req.body.DocumentData)
  await UpdateRecord(req.body.userID,{'$addToSet':{'DocumentHistory':req.body.UserData.RoomId}})
  let ans = {'stringAns':'Done!', 'id':req.body.DocumentData.RoomID}
  console.log(ans);
  res.send(ans)
});
app.post("/checkDocument",async (req, res, next) => {
  const Document = await FindOneDocRecord({RoomID:req.body.RoomID})
  console.log(req.body);
  console.log(Document[0]);
  if(!Document[0]){
    res.send({'stringAns' : 'there is no Document with that ID!'})
    return;
  }
  await UpdateRecord(req.body.userID,{'$addToSet':{'DocumentHistory':req.body.UserData.RoomId}})
  await UpdateDocRecord(req.body.RoomID,{'lastAcces':Date.now()})
  res.send({'stringAns':'Done!', 'id':req.body.RoomID , 'name': Document[0].Name})
});

app.post("/RetrieveDocument",async (req, res, next) => {
  const Document = await FindOneDocRecord({RoomID:req.body.RoomID})
  console.log(req.body);
  console.log(Document[0]);
  if(!Document[0]){
    res.send({'stringAns' : 'there is no Document with that ID!'})
    return;
  }
  console.log(Document[0].Doc);
  res.send({'stringAns':'Done!', 'id':req.body.RoomID , 'name': Document[0].Name, 'Document' : Document[0].Doc})
});

app.post("/SaveDocument",async (req, res, next) => {
  let doc = req.body.Doc;
  await UpdateDocRecord(req.body.RoomID,{'Doc':req.body.Doc})
  res.send({'stringAns':'Done!', 'id':req.body.RoomID})
});

app.post("/DocumentList", async (req, res) => {
  let user = await FindOneUserRecord({'id':req.body.id});
  let data = [];
  let DocumentData= null;
  for(var x in user[0].DocumentHistory){
    let Document = await FindOneDocRecord({'RoomID':user[0].DocumentHistory[x]});
    // console.log(Document);
    DocumentData = {
      RoomID:user[0].DocumentHistory[x],
      Name:Document[0].Name,
      Owner:Document[0].usernameOwner,
      Created:Document[0].createdat,
      LastTime:Document[0].lastAcces
    }
    data.push(DocumentData)
  }
  console.log(data);
  res.send(data)
});
///////////////////Auth////////////////////////////////////

app.post("/login", async (req, res, next) => {
  console.log('hi')
  let { username, password } = req.body;
  let existingUser = await FindOneUserRecord({'username':username});
  try{
    existingUser[0].username
  }
  catch{
    return res.send('no user found')
  }
  if (existingUser[0].password != password) {
    return res.send('Password wrong!')
  }
  let token;
  try {
    token = jwt.sign(
      {
        email: existingUser[0].email,
        Fname: existingUser[0].Fname,
        Lname: existingUser[0].Lname,
        username: existingUser[0].username,
        id: existingUser[0].id,
      },
      "secretkeyappearshere",
      { expiresIn: "100s" }
    );
  } catch (err) {
    return res.status(500).send('smth went wrong '+ err)
  }
 
  res
    .status(200)
    .json({
      success: true,
      data: {
        username: username,
        token: token,
      },
    });
});

app.post("/signup", async (req, res, next) => {
  const { Fname , Lname , email, password, username,id } = req.body;
  const newUser = {
    "id" : id,
    "Fname" : Fname,
    "Lname" : Lname,
    "email" : email,
    "username" : username,
    "password" : password
  }
  let user = await FindOneUserRecord({'username':username});
  try {
    try {
      user[0].username
      return res.send('username already used!')
    }
    catch{
      await createRecordUser(newUser);
    } 
  } catch {
    return res.status(500).send('smth went wrong')
  }
  let token;
  try {
    token = jwt.sign(
      {
       id:newUser.id, 
       email: newUser.email ,
       Fname: newUser.Fname ,
       Lname: newUser.Lname ,
       username: newUser.username
      },
      "secretkeyappearshere",
      { expiresIn: "100s" }
    );
  } catch (err) {
    return res.status(500).send(err)
  }
  res
    .status(201)
    .json({
      success: true,
      data: {email: newUser.email, token: token },
    });
});

app.post("/friendslist", async (req, res) => {
  let user = await FindOneUserRecord({'id':req.body.id});
  let data = [];
  for(var x in user[0].friends){
    let element = user[0].friends[x];
    let friend = await FindOneUserRecord({'id':element.id});
    friendData = {
      Fname:friend[0].Fname,
      Lname:friend[0].Lname,
      username:friend[0].username,
      id:friend[0].id,
      chatID:element.chatID
    }
    data.push(friendData)
  }
  res.send(data)
  
});

app.post("/addfriend", async (req, res) => {
  let User = req.body.User
  let other= req.body.other
  let MyID = req.body.id
  let otherUser = await FindOneUserRecord({'username':other});
  if(other == User){
    res.send({'string':"U can't send a request to yourself"})
    return;
  }
  try{
    otherUser[0].username
  }
  catch
  {
    res.send({'string':"No user with that Username! :c"});
    return;
  }
  let otherID = otherUser[0].id;
  const f1 = otherUser[0].requests.find(element => element.id == MyID)
  if (f1){
    res.send( {'string':"Already sent!" })
    return;
  }
  const f2 = otherUser[0].friends.find(element => element.id == MyID)
  if (f2){
    res.send({'string':"Already Friends!" })
    return;
  }
  let msg = {'username':other, 'id':otherID, 'type':'sentto'}
  let msg2 = {'username':User, 'id':MyID, 'type':'gotfrom'}
  await sendRequest(MyID, msg);
  await sendRequest(otherID, msg2);
  res.send({'string':"Request sent!" , 'otherID' : otherID});
});

app.post("/RequestList",async (req, res, next) => {
  let user = await FindOneUserRecord({'id':req.body.id});
  let data = []
  for(var x in user[0].requests){
    let element = user[0].requests[x];
    data.push(element);
  }
  res.send(data)

});

app.post("/AcceptFriend" ,async (req, res, next) => {
  let myID = req.body.id;
  let other = req.body.other;
  let data = {'id' : other, 'chatID':uuid.v4()};
  console.log(data)
  addFriend(myID, data)
  createRecordChat({chatID:data.chatID})
  res.send("done!")

});

app.post("/RejectFriend" ,async (req, res, next) => {
  let myID = req.body.id;
  let other = req.body.other;
  DeleteReq( myID , {'id' : other})
  DeleteReq( other , {'id' : myID})
  res.send("done!")

});

app.post("/Unfriend" ,async (req, res, next) => {
  let myID = req.body.id;
  let other = req.body.other;
  let chatid = req.body.chatID;
  console.log("unfriend",req.body);
  DeleteChatRecord({'chatID':chatid});
  DeleteFriend(myID , {'id' : other});
  DeleteFriend(other , {'id' : myID});
  res.send("done!")

});

app.post("/GetChat" ,async (req, res, next) => {
  let chatid = req.body.chatID;
  console.log("unfriend",req.body);
  let chat = await FindOneChatRecord({'chatID':chatid});
  res.send(chat[0].msgs)

});

app.post('/GetNotifications',async(req,res,next) =>{
  let user = await FindOneUserRecord({'id':req.body.id});
  res.send(user[0].notification);
});

app.post("/Edit" , async (req, res) =>{
  let id = req.body.id;
  let data = req.body.data;
  console.log('data',data);
  await UpdateRecord(id,data);
  res.send('Done!');
})

app.post("/ChangePassword",async (req,res)=>{
  let id = req.body.id;
  let newPass=req.body.pass;
  let oldPass = req.body.old;
  const user = await FindOneUserRecord({'id':id});
  if(user[0].password != oldPass){
    res.send("The old Password doesn't match");
    return;
  }
  UpdateRecord(id, {'password': newPass});
  res.send("done!");
})
// socket server io 
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('createRoom',(data)=>{
    if(data.type == 'textArea'){
      socket.join (data.room);
      socket.to(data.room).emit('TextAreaSock', 'Someone Connected!');
    }else {
      // console.log(data);
      socket.join(data.id);
    }
  });
  socket.on('OutOfMeeting', (data) =>{
    if(data.type == 'chatOutOfMeeting'){
      PushMsg(data.chatID, {from:data.from , msg:data.msg , name: data.name});
    }
    if(data.type == 'invite'){
      UpdateRecord(data.to,{'$push':{'notification':{
        'type':data.type,
        'username': data.username,
        'SharingID': data.room,
        'MeetingName':data.roomName
      }}})
      console.log(data);
    }
    if(data.type == 'ReplyInvite'){
      UpdateRecord(data.to,{'$push':{'notification':{
        'type':data.type,
        'username': data.from,
        'SharingID': data.room,
        'MeetingName':data.roomName
      }}})
      console.log(data);
    }
      let room = data.to;
      // console.log('room' , room);
      // console.log('data' , data);

      socket.to(room).emit('MesagesNoMeeting',data);
  });
  socket.on('msg',(data)=>{
    let dataJ=JSON.parse(data)
    // console.log(JSON.parse(data).room)
    socket.join(dataJ.room)
    // console.log(socket.rooms);
    // console.log(data);
    socket.to(dataJ.room).emit('datafromserv', data);
  })
  socket.on('TextArea',(data)=>{
    console.log(data);
    queue.enqueue(data);
    // console.log(socket.rooms);
    socket.to(data.room).emit('TextAreaSock', data);
  })
});


setTimeout(SendTextHandling,10);
function SendTextHandling(){
  if(queue.length == 0) return;
    let val = queue.dequeue();
    socket.to(val.room).emit('TextAreaSock', val);
}
server.listen(2023, () => {
  console.log('listening on *:2023');
});