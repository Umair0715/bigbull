const mongoose = require('mongoose');


const bullTrackWalletHistorySchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    amount : {
        type : Number , 
        required : [true , 'amount is required.']
    } ,
    bullTrack : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'BullTrack' ,
        default : null 
    } ,
    type : {
        type : String ,
        enum : [1 , 2 , 3 , 4 ] , // 1 = BullTrack  , 2 = BullTrack Development , 3 = sended by an admin , 4 = transfered
        default : 1 ,
    } ,
    description : {
        type : String ,
        default : null
    }
} , { timestamps : true });

bullTrackWalletHistorySchema.pre(/^find/ , function(next) {
    this.populate(['user' , 'bullTrack']);
    next();
})

const BullTrackWalletHistory = mongoose.model('BullTrackWalletHistory' , bullTrackWalletHistorySchema);
module.exports = BullTrackWalletHistory;