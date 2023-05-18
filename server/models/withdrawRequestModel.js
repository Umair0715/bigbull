const mongoose = require('mongoose');

const withdrawRequestSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'user is required.']
    } ,
    walletType : {
        type : String ,
        enum : ['ROIWallet' , 'TeamWallet' , 'CashWallet' , 'BullTrackWallet' , 'ProfitShareWallet'] ,
        required : [true , 'walletType is required.']
    } ,
    wallet : {
        type : mongoose.Schema.Types.ObjectId ,
        refPath : 'walletType'
    } ,
    usdtAddress : {
        type : String ,
        required : [true ,'USDT address is required.']
    } ,
    amount : {
        type : Number ,
        required : [true , 'Withdraw amount is required.']
    } ,
    status : {
        type : String,
        enum : ['completed' , 'pending' , 'declined'],
        default : 'pending'
    } ,
    transactionId : {
        type : String ,
        default : null 
    } ,
    proof : {
        type : String ,
        default : null 
    } ,
    description : {
        type : String ,
        default : null 
    } 
} , { timestamps : true });

withdrawRequestSchema.pre(/^find/ , function(next) {
    this.populate([
        {
            path : 'user' ,
            select : 'name username email phone isActive'
        } ,
        {
            path : 'wallet'
        }
    ]);
    next();
})

const WithdrawRequest = mongoose.model('withdrawRequest' , withdrawRequestSchema);
module.exports = WithdrawRequest;