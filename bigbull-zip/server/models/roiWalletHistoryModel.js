const mongoose = require('mongoose');

const roiWalletHistorySchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'user is required']
    } ,
    wallet : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'ROIWallet' 
    } ,
    ROI : {
        type : Number ,
        required : [true ,'Amount is required.'] , 
        default : null 
    } ,
    activeDeposit : {
        type : Number ,
        default : null 
    } , 
    description : {
        type : String ,
        default : 'Daily ROI' 
    }
} , { timestamps : true });

roiWalletHistorySchema.pre(/^find/ , function(next) {
    this.populate(['user' , 'wallet']);
    next();
})

const RoiWalletHistory = mongoose.model('RoiWalletHistory' , roiWalletHistorySchema);
module.exports = RoiWalletHistory;