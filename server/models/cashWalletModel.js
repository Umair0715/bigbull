const mongoose = require('mongoose');

const cashWalletSchema = new mongoose.Schema({
    walletType : {
        type : Number ,
        default : 4 , // 1 = ROI , 2 = Team bonus , 3 = Bull Track , 4 = Cash 
    } ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    totalBallance : {
        type : Number ,
        default : 100000 ,
        min : 0 ,
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

const CashWallet = mongoose.model('CashWallet' , cashWalletSchema);
module.exports= CashWallet;