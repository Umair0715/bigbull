const mongoose = require('mongoose');

const ProfitShareWalletSchema = new mongoose.Schema({
    walletType : {
        type : Number ,
        default : 5 , // 1 = ROI , 2 = Team wallet , 3 = Bull Track , 4 = Cash , 5 = profit Sharing wallet
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

const ProfitShareWallet = mongoose.model('ProfitShareWallet' , ProfitShareWalletSchema);
module.exports = ProfitShareWallet;