const mongoose = require('mongoose');

const ROIWalletSchema = new mongoose.Schema({
    walletType : {
        type : Number ,
        default : 1 , // 1 = ROI , 2 = Team wallet , 3 = Bull Track , 4 = Cash 
    } ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    totalBallance : {
        type : Number ,
        default : 0 
    } ,
    totalTransfer : {
        type : Number ,
        default : 0 ,
    } ,
    totalWithdraw : {
        type : Number ,
        default : 0 
    }
} , { timestamps : true });

const ROIWallet = mongoose.model('ROIWallet' , ROIWalletSchema);
module.exports = ROIWallet;