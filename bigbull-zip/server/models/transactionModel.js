const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new mongoose.Schema({
    from : {
        type : Schema.Types.ObjectId,
        ref : 'User' ,
        required : [true , 'sender is required.'] 
    } ,
    fromUsername : {
        type : String ,
        default : null 
    } ,
    to : {
        type : Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'receiver is required.']
    } ,
    fromWalletType : {
        type : String ,
        enum : ['ROIWallet' , 'CashWallet' , 'BullTrackWallet' , 'TeamWallet' , 'ProfitShareWallet' , null] ,
        default : null
    } ,
    fromWallet : {
        type : Schema.Types.ObjectId ,
        refPath : 'fromWalletType' ,
        default : null 
    } ,
    toWalletType : {
        type : String ,
        enum : ['ROIWallet' , 'CashWallet' , 'BullTrackWallet' , 'TeamWallet' , null] ,
        defaul : null 
    } ,
    toWallet : {
        type : Schema.Types.ObjectId ,
        refPath : 'toWalletType' ,
        default : null 
    } ,
    amount : {
        type : Number ,
        required : [true , 'Amount is required.']
    } ,
    toSelf : {
        type : Boolean ,
        required : [true , 'toSelf is required.'] , 
        default : false 
    } ,
    teamLevel : { // only in case of referral bonus
        type : Number , 
        default : null ,
    } ,
    description : {
        type : String ,
        default : null 
    } , 
} , { timestamps : true });

transactionSchema.pre(/^find/ , function(next) {
    this.populate(['from' , 'to']);
    next();
})

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;