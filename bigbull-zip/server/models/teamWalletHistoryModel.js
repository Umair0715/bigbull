const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamWalletHistorySchema = new mongoose.Schema({
    from : {
        type : Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.'] 
    } ,
    fromUsername : {
        type : String ,
        default : null 
    } ,     
    to : {
        type : Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'to is required.']
    } ,
    wallet : {
        type : mongoose.Schema.ObjectId ,
        ref : 'TeamWallet' ,
       default : null
    } ,
    amount : {
        type : Number , 
        required : [true , 'amount in digits is required']
    } ,
    description : {
        type : String ,
        default : 'One of your team member create subscription or make deposit'
    } , 
    teamLevel : {
        type : Number ,
        default : null 
    } , 
    type : {
        type : Number ,
        enum : [1 , 2 , 3 , 4] ,
        default : 1 , // 1 = level Profit , 2 = Sponser profit , 3 = sended by an admin , 4 = transfered 
    }
}, { timestamps : true });

teamWalletHistorySchema.pre(/^find/ , function(next) {
    this.populate(['from' , 'to' , 'wallet']);
    next();
});

const TeamWalletHistory = mongoose.model('TeamWalletHistory' , teamWalletHistorySchema);
module.exports = TeamWalletHistory;