var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;

const Document = new Schema(
    {
    RoomID: {type:String, unique:true},
    Owner: String,
    Name: String,
    Doc: String,
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

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4').
catch(error => handleError(error));
module.exports = {
    createDocument: (data)=>{
        const Doc = mongoose.model('Doc', Document);
        const newRecord = new Doc (data);
        newRecord.save(function (err) {
            if (err) return handleError(err);
        }); 
    },
    FindOneDocRecord: async function (data){
        const Doc = mongoose.model('Doc', Document);
        const query = await Doc.find(data).select();
        return query;
    },
    DeleteDocRecord: async function (data){
        const Doc = mongoose.model('Doc', Document);
        await Doc.deleteOne(data);
    },
    UpdateDocRecord: async function (id,data){
        const Doc = mongoose.model('Doc', Document);
        await Doc.findOneAndUpdate(
            { 'RoomID': id }, 
            data,
        );
        console.log('data db' ,data);
    }

};