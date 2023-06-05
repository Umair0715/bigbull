const mongoose = require('mongoose');

const profitSharingWalletHistorySchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    wallet : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'ProfitSharingWallet' ,
        required : [true , 'wallet is required.']
    } ,
    profitAmount : {
        type : Number ,
        required : [true , 'Profit amount is required.']
    } ,
    from : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'from is required.']
    }
} , { timestamps : true });

const ProfitShareWalletHistory = mongoose.model('ProfitShareWalletHistory' , profitSharingWalletHistorySchema);
module.exports = ProfitShareWalletHistory;