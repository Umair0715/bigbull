const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subscriptionSchema = new mongoose.Schema({
    package : {
        type : Schema.Types.ObjectId ,
        ref : 'Package',
        required : [true , 'Package is required.']
    } ,
    packageFee : {
        type : Number ,
        default : null
    } ,
    depositAmount : {
        type : Number ,
        required : [true , 'Deposit amount is required.']
    } ,
    user : {
        type : Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } , 
    expireDate : {
        type : Date ,
        required : [true , 'Subscription Expire date is required.']
    } ,
    paymentMethod : {
        type : Number ,
        default : 1 , // 1 = CashWallet , 2 = USD
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }
}, { timestamps : true });

subscriptionSchema.pre(/^find/ , function(next) {
    this.populate('package')
    next();
})

const Subscription = mongoose.model('Subscription' , subscriptionSchema);
module.exports = Subscription;