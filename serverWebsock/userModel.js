var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;

const FriendsArr = new mongoose.Schema({
    id:{
        type:String,
        trim: true
    },
    chatID:{
        type:String,
        trim:true
    }
})
const RequestsArr = new mongoose.Schema({
    id:{
        type:String,
        trim: true
    },
    username:{
        type:String,
        trim: true
    },
    type:{
        type:String,
        trim:true
    }
})

const notificationArr = new mongoose.Schema({
    username:{
        type:String
    },
    type:{
        type:String,
        trim:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    SharingID:{
        type:String
    },
    MeetingName:{
        type:String
    }
})

const UserSchema = new Schema({
    id:String,
    Fname: String,
    Lname: String,
    username: String,
    email: String,
    friends:[FriendsArr],
    requests:[RequestsArr],
    DocumentHistory:[String],
    MeetingHistory:[String],
    notification:[notificationArr],
    password: String,
    created: Date,},
    { typeKey: '$type' }
);

mongoose.connect('mongodb://localhost:27017').
catch(error => handleError(error));
module.exports = {
    createRecordUser: (data)=>{
        const User = mongoose.model('User', UserSchema);
        const newRecord = new User (data);
        newRecord.save(function (err) {
            if (err) return handleError(err);
        });
        
    },
    UpdateRecord: async function (id,data){
        const User = mongoose.model('User', UserSchema);
        await User.findOneAndUpdate(
            { 'id': id }, 
            data,
        );
        console.log('data db' ,data);
    },
    FindOneUserRecord: async function (data){
        const User = mongoose.model('User', UserSchema);
        const query = await User.find(data).select();
        return query;
    },
    sendRequest: async function (id,data){
        const User = mongoose.model('User', UserSchema);
        const query = await User.findOneAndUpdate(
            { 'id': id }, 
            { $push: { 'requests': data } },
        );
    },addFriend: async function (id,data){
        const User = mongoose.model('User', UserSchema);
        await User.findOneAndUpdate(
            { 'id': id }, 
            { 
                $pull : { 'requests': {'id':data.id} },
                $push : {'friends' : data}
            },
        );
        await User.findOneAndUpdate(
            { 'id': data.id }, 
            { 
                $pull : { 'requests': {'id':id} },
                $push : {'friends' : {'id':id , 'chatID' : data.chatID}}
            },
        );
    },DeleteFriend: async function (id,data){
        const User = mongoose.model('User', UserSchema);
        await User.findOneAndUpdate(
            { 'id': id }, 
            { 
                $pull : { 'friends' : data },
            },
        );
    },DeleteReq: async function (id,data){
        const User = mongoose.model('User', UserSchema);
        await User.findOneAndUpdate(
            { 'id': id }, 
            { 
                $pull : { 'requests' : data },
            },
        );
    },

}
      
  