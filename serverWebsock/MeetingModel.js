var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;

const Meeting = new Schema(
    {
    RoomID: {type:String,unique:true},
    Owner: String,
    Name: String,
    usernameOwner: String,
    createdat: {
        type:Date,
        default: Date.now()
    },
    lastAcces:{
        type:Date,
        default: Date.now()
    }
    }
);

mongoose.connect('mongodb://localhost:27017').
catch(error => handleError(error));
module.exports = {
    createMeeting: (data)=>{
        const Meet = mongoose.model('Meet', Meeting);
        const newRecord = new Meet (data);
        newRecord.save(function (err) {
            if (err) return handleError(err);
        }); 
    },
    FindOneMeetingRecord: async function (data){
        const Meet = mongoose.model('Meet', Meeting);
        const query = await Meet.find(data).select();
        return query;
    },
    DeleteMeetingRecord: async function (data){
        const Meet = mongoose.model('Meet', Meeting);
        await Meet.deleteOne(data);
    },
    UpdateMeetingRecord: async function (id,data){
        const Meet = mongoose.model('Meet', Meeting);
        await Meet.findOneAndUpdate(
            { 'RoomID': id }, 
            data,
        );
        console.log('data db' ,data);
    }

};