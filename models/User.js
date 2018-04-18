const mongoose = require("mongoose");


// Create Schema  
const Schema  = mongoose.Schema;

const UserSchema  = new Schema({
    name :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    password :{
        type:String,
        required:true
    },
    Date :{
        type:Date,
        default:Date.now
    }
});

mongoose.model('user',UserSchema);