const mongoose = require('mongoose');

const ranksSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , 'Name is required.']
    } ,
    image : {
        type : String ,
        default : null
    } ,
    description : {
        type : String ,
        default : null 
    } ,
    achieveAmount : {
        type : Number , 
        required : [true , 'Achieve Amount is required.']
    } ,
    countLines : {
        type : Number , 
        default : 3 
    } ,
}, { timestamps : true });



const Rank = mongoose.model('Rank' , ranksSchema );
module.exports = Rank;