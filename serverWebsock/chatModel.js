var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;

const ChatMsgs = new Schema(
    {
    chatID: String,
    msgs:[
        {
        from:String,
        msg:String, 
        name:String}
    ],
    },{ typeKey: '$type' }
);

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4').
catch(error => handleError(error));
module.exports = {
    createRecordChat: (data)=>{
        const chat = mongoose.model('chat', ChatMsgs);
        const newRecord = new chat (data);
        newRecord.save(function (err) {
            if (err) return handleError(err);
        }); 
    },
    FindOneChatRecord: async function (data){
        const chat = mongoose.model('chat', ChatMsgs);
        const query = await chat.find(data).select();
        return query;
    },
    DeleteChatRecord: async function (data){
        const chat = mongoose.model('chat', ChatMsgs);
        await chat.deleteOne(data);
    },
    PushMsg: async function (id,msg){
        const chat = mongoose.model('chat', ChatMsgs);
        console.log('msg' , msg);
        await chat.findOneAndUpdate(
            {'chatID':id},
            {$push : {'msgs':{from:msg.from,'msg':msg.msg,name:msg.name}}}
            )
    },

};