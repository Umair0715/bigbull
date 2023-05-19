const mongoose = require('mongoose');


const depositHistorySchema = new mongoose.Schema({
    //amount , package , user , paymentMethod , type = update/active , timestamps 
    amount : {
        type : Number , 
        required : [true , 'Amount is required.'] ,
    } ,
    package : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Package' ,
        required : [true , 'Package is required.']
    } ,
    user : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'User' , 
        required : [true , 'User is required.'] 
    } ,
    paymentMethod : {
        type : Number , 
        default : 1 , 
        enum : [1 , 2] // 1 = cashWallet , 2 = USDT
    } , 
    type : {
        type : String ,
        enum : ['update' , 'active'] ,
        default : 'active'
    } , 
} , { timestamps : true });


const DepositHistory = mongoose.model('DepositHistory' , depositHistorySchema);
module.exports = DepositHistory;