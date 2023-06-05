const mongoose = require('mongoose');


const bullTrackSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    bullTrackUsers : {
        type : [
            {
                user : {
                    type : mongoose.Schema.Types.ObjectId ,
                    ref : 'User'
                }
            }
        ] ,
        default : null
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    } ,
    status : {
        type : String ,
        enum : ['running' , 'completed' , 'finished' , 'expired'] ,
        default : 'running' ,
    },
    completedAt : {
        type : Date ,
        default : null 
    } , 
    expiredAt : {
        type : Date ,
        default : null
    } , 
    isExpired : {
        type : Boolean ,
        default : false ,
    }
} , { timestamps : true });

const BullTrack = mongoose.model('BullTrack' , bullTrackSchema);
module.exports = BullTrack;