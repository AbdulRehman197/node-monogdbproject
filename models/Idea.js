const mongoose = require("mongoose");


// Create Schema  
const Schema  = mongoose.Schema;

const IdeaSchema  = new Schema({
    title :{
        type:String,
        require:true
    },
    details :{
        type:String,
        require:true
    },
    Date :{
        type:Date,
        default:Date.now
    }
});

mongoose.model('ideas',IdeaSchema);