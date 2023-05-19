const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    depositAmount : {
        type : Number ,
        required : [true , 'Deposit Amount is required.']
    } ,
    package : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Package' ,
        required : [true , 'Package is required.']
    } ,
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'User id is required.']
    } ,
    status : {
        type : String ,
        enum : ['pending' , 'declined' , 'approved'] ,
        default : 'pending'
    } ,
    proof : {
        type : String , 
        default : null 
    } ,
    descrption : {
        type : String ,
        default :'Request is pending' 
    } ,
    txId : {
        type : String , 
        required : [true , 'TxId is required.']
    } , 
    paymentMethod : {
        type : Number ,
        default : 1 , // 1 = CashWallet , 2 = USD
    } ,
    packageFee : {
        type : Number ,
        required : [true , 'package fee is required.']
    }
});

const Deposit = mongoose.model('Deposit' , depositSchema);
module.exports = Deposit;