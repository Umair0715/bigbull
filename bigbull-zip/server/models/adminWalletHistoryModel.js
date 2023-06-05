const mongoose = require('mongoose');

const adminWalletHistorySchema = new mongoose.Schema({
    admin : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Admin' ,
        required : [true , 'Admin is required.']
    } ,
    wallet : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'AdminWallet' ,
        required : [true , 'Admin wallet is required.']
    } ,
    amount : {
        type : Number ,
        required : [true , 'Amount is required.']
    } ,
    description : {
        type : String ,
        default : 'Package fee received'
    }
} , { timestamps : true });

const AdminWalletHistory = mongoose.model('AdminWalletHistory' , adminWalletHistorySchema);
module.exports = AdminWalletHistory;